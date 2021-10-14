import {
	SongBase,
	GenreBase,
	ImageInput,
	ImageSizes,
	ArtistBase,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import { join } from "path"
import pipe from "@oly_op/pipe"
import { random } from "lodash"
import { readFileSync } from "fs"
import * as mm from "music-metadata"
import { v4 as createUUID } from "uuid"
import { FastifyPluginCallback } from "fastify"
import { convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers"

import {
	uploadFileToS3,
	addIndexToAlgolia,
	determineS3ImageURL,
	determineS3AudioPath,
	normalizeImageAndUploadToS3,
} from "../helpers"

import { BodyEntry } from "../types"
import { UPLOAD_PLUGINS_PATH } from "../../../globals"

interface Item {
	index: number,
	value: string,
}

interface Body extends Record<string, unknown> {
	title: string,
	songs: string,
	artists: string,
	released: string,
	cover: BodyEntry[],
}

interface Route {
	Body: Body,
}

type SongBaseBase =
	Omit<SongBase, "songID" | "bpm" | "key" | "duration">

interface Song extends SongBaseBase {
	genres: Item[],
	artists: Item[],
	remixers: Item[],
	featuring: Item[],
}
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

const importSQL =
	(fileName: string) =>
		readFileSync(join(UPLOAD_PLUGINS_PATH, "album", fileName)).toString()

const INSERT_SONG = importSQL("insert-song.sql")
const INSERT_ALBUM = importSQL("insert-album.sql")
const SELECT_GENRE = importSQL("select-genre.sql")
const SELECT_ARTIST = importSQL("select-artist.sql")
const INSERT_SONG_GENRE = importSQL("insert-song-genre.sql")
const INSERT_SONG_ARTIST = importSQL("insert-song-artist.sql")
const INSERT_SONG_REMIXER = importSQL("insert-song-remixer.sql")
const INSERT_ALBUM_ARTIST = importSQL("insert-album-artist.sql")
const INSERT_SONG_FEATURING = importSQL("insert-song-featuring.sql")

export const uploadAlbum: FastifyPluginCallback =
	(fastify, options, done) => {
		fastify.post<Route>(
			"/upload/album",
			async (request, reply) => {
				const albumID = createUUID()
				const { title, cover, released } = request.body
				const songs = JSON.parse<Song[]>(request.body.songs)
				const artists = JSON.parse<Item[]>(request.body.artists)

				await normalizeImageAndUploadToS3({
					images,
					objectID: albumID,
					buffer: cover[0].data,
				})

				await addIndexToAlgolia({
					text: title,
					typeName: "Album",
					objectID: albumID,
					image: determineS3ImageURL(albumID, images[2]),
				})

				await query(fastify.pg.pool)(INSERT_ALBUM)({
					variables: [{
						key: "albumID",
						value: albumID,
					},{
						key: "released",
						value: released,
					},{
						key: "title",
						value: title,
						parameterized: true,
					}],
				})

				for (const artist of artists) {
					await query(fastify.pg.pool)(INSERT_ALBUM_ARTIST)({
						variables: [{
							key: "albumID",
							value: albumID,
						},{
							key: "index",
							value: artist.index,
						},{
							key: "artistID",
							value: await query(fastify.pg.pool)(SELECT_ARTIST)({
								parse: pipe(
									convertFirstRowToCamelCase<ArtistBase>(),
									({ artistID }) => artistID,
								),
								variables: [{
									key: "name",
									value: artist.value,
									parameterized: true,
								}],
							}),
						}],
					})
				}

				for (const song of songs) {
					const songID = createUUID()

					const audio =
						(request.body[`${song.trackNumber}-audio`] as BodyEntry[])[0].data

					const duration =
						(await mm.parseBuffer(audio)).format.duration!

					await uploadFileToS3(
						determineS3AudioPath(songID),
						audio,
					)

					await addIndexToAlgolia({
						text: song.title,
						objectID: songID,
						typeName: "Song",
					})

					await query(fastify.pg.pool)(INSERT_SONG)({
						variables: [{
							key: "keyID",
							value: keyID,
						},{
							key: "songID",
							value: songID,
						},{
							key: "albumID",
							value: albumID,
						},{
							key: "duration",
							value: duration,
						},{
							key: "mix",
							value: song.mix,
							parameterized: true,
						},{
							key: "title",
							value: song.title,
							parameterized: true,
						},{
							key: "discNumber",
							value: song.discNumber,
						},{
							key: "trackNumber",
							value: song.trackNumber,
						},{
							key: "bpm",
							value: random(85, 130),
						}],
					})

					for (const genre of song.genres) {
						await query(fastify.pg.pool)(INSERT_SONG_GENRE)({
							variables: [{
								key: "songID",
								value: songID,
							},{
								key: "index",
								value: genre.index,
							},{
								key: "genreID",
								value: await query(fastify.pg.pool)(SELECT_GENRE)({
									parse: pipe(
										convertFirstRowToCamelCase<GenreBase>(),
										({ genreID }) => genreID,
									),
									variables: [{
										key: "name",
										value: genre.value,
										parameterized: true,
									}],
								}),
							}],
						})
					}

					for (const artist of song.artists) {
						await query(fastify.pg.pool)(INSERT_SONG_ARTIST)({
							variables: [{
								key: "songID",
								value: songID,
							},{
								key: "index",
								value: artist.index,
							},{
								key: "artistID",
								value: await query(fastify.pg.pool)(SELECT_ARTIST)({
									parse: pipe(
										convertFirstRowToCamelCase<ArtistBase>(),
										({ artistID }) => artistID,
									),
									variables: [{
										key: "name",
										parameterized: true,
										value: artist.value,
									}],
								}),
							}],
						})
					}

					for (const remixer of song.remixers) {
						await query(fastify.pg.pool)(INSERT_SONG_REMIXER)({
							variables: [{
								key: "songID",
								value: songID,
							},{
								key: "index",
								value: remixer.index,
							},{
								key: "artistID",
								value: await query(fastify.pg.pool)(SELECT_ARTIST)({
									parse: pipe(
										convertFirstRowToCamelCase<ArtistBase>(),
										({ artistID }) => artistID,
									),
									variables: [{
										key: "name",
										parameterized: true,
										value: remixer.value,
									}],
								}),
							}],
						})
					}

					for (const featuring of song.featuring) {
						await query(fastify.pg.pool)(INSERT_SONG_FEATURING)({
							variables: [{
								key: "songID",
								value: songID,
							},{
								key: "index",
								value: featuring.index,
							},{
								key: "artistID",
								value: await query(fastify.pg.pool)(SELECT_ARTIST)({
									parse: pipe(
										convertFirstRowToCamelCase<ArtistBase>(),
										({ artistID }) => artistID,
									),
									variables: [{
										key: "name",
										parameterized: true,
										value: featuring.value,
									}],
								}),
							}],
						})
					}
				}

				return reply.send()
			},
		)
		done()
	}