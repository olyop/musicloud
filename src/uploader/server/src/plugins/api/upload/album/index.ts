import {
	SongID,
	AlbumID,
	GenreIDNameBase,
	AlbumIDTitleBase,
	ArtistIDNameBase,
	AlgoliaRecordSong,
	AlgoliaRecordAlbum,
} from "@oly_op/musicloud-common/build/types"

import { random, trim } from "lodash-es"
import musicMetadata from "music-metadata"
import { FastifyPluginAsync } from "fastify"
import { query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import {
	INSERT_SONG,
	INSERT_ALBUM,
	INSERT_SONG_GENRE,
	INSERT_SONG_ARTIST,
	INSERT_SONG_FEATURE,
	INSERT_SONG_REMIXER,
	INSERT_ALBUM_ARTIST,
} from "./sql"

import {
	uploadFileToS3,
	addRecordToSearchIndex,
	determineCatalogImageURL,
	determineCatalogAudioPath,
	normalizeImageAndUploadToS3,
} from "../helpers"

import { BodyEntry } from "../../types"
import getGenreID from "./get-genre-id"
import coverInputs from "./cover-inputs"
import getArtistID from "./get-artist-id"
import { List, Route, Song } from "./types"
import checkRelationships from "./check-relationships"

export const uploadAlbum: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>(
			"/album",
			{ onRequest: fastify.authenticate },
			async (request, reply) => {
				const { body } = request
				const { cover, released } = body

				const albumTitle =
					trim(body.title)

				const songs =
					JSON.parse(body.songs) as Song[]

				const albumArtistsList =
					JSON.parse(body.artists) as List

				await checkRelationships(fastify.pg.pool)(
					albumArtistsList,
					songs,
				)

				const { albumID } =
					await query(fastify.pg.pool)(INSERT_ALBUM)({
						parse: convertFirstRowToCamelCase<AlbumID>(),
						variables: [{
							key: "released",
							value: released,
							parameterized: true,
						},{
							key: "title",
							value: albumTitle,
							parameterized: true,
						}],
					})

				await normalizeImageAndUploadToS3(fastify.s3)({
					objectID: albumID,
					images: coverInputs,
					buffer: cover[0]!.data,
				})

				const album: AlbumIDTitleBase = {
					albumID,
					title: albumTitle,
				}

				const albumCoverURL =
					determineCatalogImageURL(albumID, coverInputs[2]!)

				const albumArtists: ArtistIDNameBase[] = []

				for (const artistItem of albumArtistsList) {
					const { index } = artistItem
					const name = trim(artistItem.value)

					const artistID =
						await getArtistID(fastify.pg.pool)(name)

					await query(fastify.pg.pool)(INSERT_ALBUM_ARTIST)({
						variables: {
							index,
							albumID,
							artistID,
						},
					})

					albumArtists.push({ artistID, name })
				}

				await addRecordToSearchIndex(fastify.ag.index)<AlgoliaRecordAlbum>({
					plays: 0,
					title: albumTitle,
					typeName: "Album",
					objectID: albumID,
					image: albumCoverURL,
					artists: albumArtists,
				})

				for (const song of songs) {
					const mix = trim(song.mix)
					const songTitle = trim(song.title)

					const audio =
						// @ts-ignore
						(body[`${song.trackNumber}-audio`] as BodyEntry[])[0]!.data

					const duration =
						(await musicMetadata.parseBuffer(audio)).format.duration!

					const { songID } =
						await query(fastify.pg.pool)(INSERT_SONG)({
							parse: convertFirstRowToCamelCase<SongID>(),
							variables: [{
								key: "albumID",
								value: albumID,
							},{
								key: "duration",
								value: duration,
							},{
								key: "mix",
								value: mix,
								parameterized: true,
							},{
								key: "title",
								value: songTitle,
								parameterized: true,
							},{
								key: "bpm",
								value: random(85, 130),
							},{
								key: "discNumber",
								value: song.discNumber,
							},{
								key: "trackNumber",
								value: song.trackNumber,
							},{
								key: "keyID",
								value: "13e9c04a-a1e5-4405-870c-8520fbc2854f",
							}],
						})

					const songGenreList = song.genres
					const songArtistList = song.artists
					const songRemixerList = song.remixers
					const songFeatureList = song.featuring
					const songGenres: GenreIDNameBase[] = []
					const songArtists: ArtistIDNameBase[] = []
					const songRemixers: ArtistIDNameBase[] = []
					const songFeaturing: ArtistIDNameBase[] = []

					for (const genreItem of songGenreList) {
						const { index } = genreItem
						const name = trim(genreItem.value)

						const genreID =
							await getGenreID(fastify.pg.pool)(name)

						await query(fastify.pg.pool)(INSERT_SONG_GENRE)({
							variables: {
								index,
								songID,
								genreID,
							},
						})

						songGenres.push({ genreID, name })
					}

					for (const songArtistItem of songArtistList) {
						const { index } = songArtistItem
						const name = trim(songArtistItem.value)

						const artistID =
							await getArtistID(fastify.pg.pool)(name)

						await query(fastify.pg.pool)(INSERT_SONG_ARTIST)({
							variables: {
								index,
								songID,
								artistID,
							},
						})

						songArtists.push({ artistID, name })
					}

					for (const songRemixerItem of songRemixerList) {
						const { index } = songRemixerItem
						const name = trim(songRemixerItem.value)

						const artistID =
							await getArtistID(fastify.pg.pool)(name)

						await query(fastify.pg.pool)(INSERT_SONG_REMIXER)({
							variables: {
								index,
								songID,
								artistID,
							},
						})

						songRemixers.push({ artistID, name })
					}

					for (const songFeatureItem of songFeatureList) {
						const { index } = songFeatureItem
						const name = trim(songFeatureItem.value)

						const artistID =
							await getArtistID(fastify.pg.pool)(name)

						await query(fastify.pg.pool)(INSERT_SONG_FEATURE)({
							variables: {
								index,
								songID,
								artistID,
							},
						})

						songFeaturing.push({ artistID, name })
					}

					await uploadFileToS3(fastify.s3)(
						determineCatalogAudioPath(songID),
						audio,
					)

					await addRecordToSearchIndex(fastify.ag.index)<AlgoliaRecordSong>({
						mix,
						album,
						plays: 0,
						title: songTitle,
						typeName: "Song",
						objectID: songID,
						genres: songGenres,
						artists: songArtists,
						image: albumCoverURL,
						remixers: songRemixers,
						featuring: songFeaturing,
					})
				}

				void reply.code(201)

				return {
					albumID,
				}
			},
		)
	}