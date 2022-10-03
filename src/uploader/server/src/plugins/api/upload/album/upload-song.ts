import { PoolClient } from "pg"
import { Readable } from "node:stream"
import { SearchIndex } from "algoliasearch"
import { parseBuffer } from "music-metadata"
import { S3Client } from "@aws-sdk/client-s3"
// eslint-disable-next-line import/no-unresolved
import { isNull, random, trim } from "lodash-es"
import { getAudioDurationInSeconds } from "get-audio-duration"
import { convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers"
import { AlbumID, AlbumIDTitleBase, AlgoliaRecordSong, ArtistIDNameBase, GenreIDNameBase, SongID } from "@oly_op/musicloud-common/build/types"

import { Body, Song } from "./types"
import { BodyEntry } from "../../types"
import getArtistID from "./get-artist-id"
import getGenreID from "./get-genre-id"
import { INSERT_SONG, INSERT_SONG_ARTIST, INSERT_SONG_FEATURE, INSERT_SONG_GENRE, INSERT_SONG_REMIXER } from "./sql"
import { addRecordToSearchIndex, deleteRecordFromSearchIndex, determineCatalogAudioPath, uploadFileToS3 } from "../helpers"

const uploadSong =
	(client: PoolClient, s3: S3Client, ag: SearchIndex) =>
		async (options: Options) => {
			const {
				body,
				song,
				albumID,
				album,
				albumCoverURL,
			} = options

			const mix = trim(song.mix)
			const songTitle = trim(song.title)

			const audio =
				// @ts-expect-error
				(body[`${song.trackNumber}-audio`] as BodyEntry[])[0]!.data

			console.log(`Start Song Upload: ${songTitle}`)

			let duration: number | null = null
			try {
				const audioMetadata = await parseBuffer(audio)
				duration = audioMetadata.format.duration ?? null
				if (isNull(duration)) {
					duration = await getAudioDurationInSeconds(Readable.from(audio))
					if (isNull(duration)) {
						duration = 300
					}
				}
			} catch (error) {
				duration = 300
			}

			let songID: string | null = null

			try {
				const songResult =
					await query(client)(INSERT_SONG)({
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
							// TODO: Add audio musical key recongition
							value: "13e9c04a-a1e5-4405-870c-8520fbc2854f",
						}],
					})

				songID = songResult.songID

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
						await getGenreID(client)(name)

					await query(client)(INSERT_SONG_GENRE)({
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
						await getArtistID(client)(name)

					await query(client)(INSERT_SONG_ARTIST)({
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
						await getArtistID(client)(name)

					await query(client)(INSERT_SONG_REMIXER)({
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
						await getArtistID(client)(name)

					await query(client)(INSERT_SONG_FEATURE)({
						variables: {
							index,
							songID,
							artistID,
						},
					})

					songFeaturing.push({ artistID, name })
				}

				await uploadFileToS3(s3)(
					determineCatalogAudioPath(songID),
					audio,
				)

				await addRecordToSearchIndex(ag)<AlgoliaRecordSong>({
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

				console.log(`Finish Song Upload: ${songTitle}`)
			} catch (error) {
				if (songID) {
					await deleteRecordFromSearchIndex(ag)({
						objectID: songID,
					})
				}

				throw new Error(`Error uploading song: ${(error as Error).message}`)
			}
		}

interface Options extends AlbumID {
	song: Song,
	body: Body,
	albumCoverURL: string,
	album: AlbumIDTitleBase,
}

export default uploadSong