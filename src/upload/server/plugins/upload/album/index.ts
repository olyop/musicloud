import {
	SongID,
	AlbumID,
	ImageSizes,
	ImageDimensions,
	GenreIDNameBase,
	AlbumIDTitleBase,
	ArtistIDNameBase,
	AlgoliaRecordAlbum,
	AlgoliaRecordSong,
} from "@oly_op/music-app-common/types"

import { random, trim } from "lodash"
import { FastifyPluginCallback } from "fastify"
import { parseBuffer } from "music-metadata/lib/core"
import { query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import {
	uploadFileToS3,
	determineS3ImageURL,
	determineS3AudioPath,
	addRecordToSearchIndex,
	normalizeImageAndUploadToS3,
} from "../helpers"

import importSQL from "./import-sql"
import getGenreID from "./get-genre-id"
import getArtistID from "./get-artist-id"
import { List, Route, Song } from "./types"
import { BodyEntry, ImageInput } from "../types"
import checkRelationships from "./check-relationships"

const keyID =
	"13e9c04a-a1e5-4405-870c-8520fbc2854f"

const images: ImageInput[] = [{
	name: "cover",
	size: ImageSizes.MINI,
	dimension: ImageDimensions.SQUARE,
},{
	name: "cover",
	size: ImageSizes.HALF,
	dimension: ImageDimensions.SQUARE,
},{
	name: "cover",
	size: ImageSizes.FULL,
	dimension: ImageDimensions.SQUARE,
}]

const INSERT_SONG = importSQL("insert-song")
const INSERT_ALBUM = importSQL("insert-album")
const INSERT_SONG_GENRE = importSQL("insert-song-genre")
const INSERT_SONG_ARTIST = importSQL("insert-song-artist")
const INSERT_ALBUM_ARTIST = importSQL("insert-album-artist")
const INSERT_SONG_REMIXER = importSQL("insert-song-remixer")
const INSERT_SONG_FEATURE = importSQL("insert-song-feature")

export const uploadAlbum: FastifyPluginCallback =
	(fastify, options, done) => {
		fastify.post<Route>(
			"/upload/album",
			async (request, reply) => {
				const { cover, released } = request.body
				const albumTitle = trim(request.body.title)
				const songs = JSON.parse(request.body.songs) as Song[]
				const albumArtistsList = JSON.parse(request.body.artists) as List

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
						},{
							key: "title",
							value: albumTitle,
							parameterized: true,
						}],
					})

				await normalizeImageAndUploadToS3({
					images,
					objectID: albumID,
					buffer: cover[0].data,
				})

				const album: AlbumIDTitleBase =
					{ albumID, title: albumTitle }

				const albumCoverURL =
					determineS3ImageURL(albumID, images[2])

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

				await addRecordToSearchIndex<AlgoliaRecordAlbum>({
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
						(request.body[`${song.trackNumber}-audio`] as BodyEntry[])[0].data

					const duration =
						(await parseBuffer(audio)).format.duration!

					const { songID } =
						await query(fastify.pg.pool)(INSERT_SONG)({
							parse: convertFirstRowToCamelCase<SongID>(),
							variables: [{
								key: "keyID",
								value: keyID,
							},{
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

					await uploadFileToS3(
						determineS3AudioPath(songID),
						audio,
					)

					await addRecordToSearchIndex<AlgoliaRecordSong>({
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

				return reply.send()
			},
		)
		done()
	}