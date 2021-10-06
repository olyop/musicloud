import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
	getResultRowCountOrNull,
	convertFirstRowToCamelCase,
	Parse,
} from "@oly_op/pg-helpers"

import pipe from "@oly_op/pipe"
import { random } from "lodash"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { NAME } from "@oly_op/music-app-common/metadata"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { PlaylistIDBase, SongIDBase } from "@oly_op/music-app-common/types"

import {
	Key,
	Song,
	Play,
	Album,
	Genre,
	Artist,
	PlaylistSong,
	GetObjectsOptions,
} from "../types"

import {
	createResolver,
	getObjectInLibrary,
	getObjectDateAddedToLibrary,
} from "./helpers"

import {
	SELECT_KEY_BY_ID,
	SELECT_SONG_PLAYS,
	SELECT_ALBUM_BY_ID,
	SELECT_SONG_GENRES,
	SELECT_SONG_ARTISTS,
	SELECT_SONG_REMIXERS,
	SELECT_PLAYLIST_SONG,
	SELECT_SONG_FEATURING,
	SELECT_OBJECT_SONG_PLAYS,
} from "../sql"

import { COLUMN_NAMES } from "../globals"

const resolver =
	createResolver<Song>()

export const size =
	resolver(
		async ({ parent, context }) => {
			const songID = removeDashesFromUUID(parent.songID)
			const command = new GetObjectCommand({
				Bucket: NAME,
				Key: `catalog/${songID}/audio/index.mp3`,
			})
			return (await context.s3.send(command)).ContentLength!
		},
	)

export const key =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_KEY_BY_ID)({
				parse: convertFirstRowToCamelCase<Key>(),
				variables: {
					keyID: parent.keyID,
					columnNames: join(COLUMN_NAMES.KEY),
				},
			})
		),
	)

export const album =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ALBUM_BY_ID)({
				parse: convertFirstRowToCamelCase<Album>(),
				variables: {
					albumID: parent.albumID,
					columnNames: join(COLUMN_NAMES.ALBUM),
				},
			})
		),
	)

export const genres =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_SONG_GENRES)({
				parse: convertTableToCamelCase<Genre>(),
				variables: {
					songID: parent.songID,
					columnNames: join(COLUMN_NAMES.GENRE, "genres"),
				},
			})
		),
	)

export const artists =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_SONG_ARTISTS)({
				parse: convertTableToCamelCase<Artist>(),
				variables: {
					songID: parent.songID,
					columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
				},
			})
		),
	)

export const remixers =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_SONG_REMIXERS)({
				parse: convertTableToCamelCase<Artist>(),
				variables: {
					songID: parent.songID,
					columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
				},
			})
		),
	)

export const featuring =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_SONG_FEATURING)({
				parse: convertTableToCamelCase<Artist>(),
				variables: {
					songID: parent.songID,
					columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
				},
			})
		),
	)

export const playsTotal =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_SONG_PLAYS)({
				parse: pipe(
					getResultRowCountOrNull,
					plays => plays && (plays * 10000),
					plays => plays && plays + random(0, 10000),
				),
				variables: {
					songID: parent.songID,
					columnNames: join(COLUMN_NAMES.PLAY),
				},
			})
		),
	)

const getUserPlays =
	(client: PoolOrClient) =>
		(userID: string) =>
			<T>({ objectID, parse }: GetObjectsOptions<T>) =>
				query(client)(SELECT_OBJECT_SONG_PLAYS)({
					parse,
					variables: {
						userID,
						songID: objectID,
						columnNames: join(COLUMN_NAMES.PLAY),
					},
				})

export const userPlays =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				objectID: parent.songID,
				parse: convertTableToCamelCase<Play>(),
			})
		),
	)

export const userPlaysTotal =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				objectID: parent.songID,
				parse: getResultRowCountOrNull,
			})
		),
	)

export const dateAddedToLibrary =
	resolver(
		({ parent, context }) => (
			getObjectDateAddedToLibrary(context.pg)({
				columnName: "song_id",
				objectID: parent.songID,
				libraryTableName: "library_songs",
				userID: context.authorization!.userID,
			})
		),
	)

export const inLibrary =
	resolver(
		({ parent, context }) => (
			getObjectInLibrary(context.pg)({
				columnName: "song_id",
				objectID: parent.songID,
				libraryTableName: "library_songs",
				userID: context.authorization!.userID,
			})
		),
	)

interface GetPlaylistSongOptions<T> extends SongIDBase, PlaylistIDBase {
	parse: Parse<T>,
}

const getPlaylistSong =
	(client: PoolOrClient) =>
		<T>({ parse, songID, playlistID }: GetPlaylistSongOptions<T>) =>
			query(client)(SELECT_PLAYLIST_SONG)({
				parse,
				variables: {
					songID,
					playlistID,
					columnNames: join(COLUMN_NAMES.PLAYLIST_SONG),
				},
			})

export const playlistIndex =
	resolver<number, PlaylistIDBase>(
		({ parent, context, args }) => (
			getPlaylistSong(context.pg)({
				songID: parent.songID,
				playlistID: args.playlistID,
				parse: pipe(
					convertFirstRowToCamelCase<PlaylistSong>(),
					({ index }) => index,
				),
			})
		),
	)

export const dateAddedToPlaylist =
	resolver<number | null, PlaylistIDBase>(
		({ parent, context, args }) => (
			getPlaylistSong(context.pg)({
				songID: parent.songID,
				playlistID: args.playlistID,
				parse: result => (
					result.rowCount === 0 ?
						null :
						convertFirstRowToCamelCase<PlaylistSong>()(result).dateAdded * 1000
				),
			})
		),
	)