import { ForbiddenError, UserInputError } from "apollo-server-fastify"
import { PlaylistID, UserID } from "@oly_op/music-app-common/types"
import { convertFirstRowToCamelCase, exists, join, PoolOrClient, query } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Playlist } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { UPDATE_PLAYLIST_IS_PUBLIC } from "../../sql"
import { isNotUsersPlaylist } from "../helpers"

interface UpdatePlaylistPublicValueOptions
	extends Pick<Playlist, "isPublic" | "playlistID">, UserID {}

const handlePlaylistPublicValue =
	(pg: PoolOrClient) =>
		async ({ playlistID, userID, isPublic }: UpdatePlaylistPublicValueOptions) => {
			const playlistExists =
				await exists(pg)({
					value: playlistID,
					table: "playlists",
					column: COLUMN_NAMES.PLAYLIST[0],
				})

			if (!playlistExists) {
				throw new UserInputError("Playlist does not exist")
			}

			if (await isNotUsersPlaylist(pg)({ userID, playlistID })) {
				throw new ForbiddenError("Unauthorized to delete playlist")
			}

			return query(pg)(UPDATE_PLAYLIST_IS_PUBLIC)({
				parse: convertFirstRowToCamelCase<Playlist>(),
				variables: {
					isPublic,
					playlistID,
					columnNames: join(COLUMN_NAMES.PLAYLIST),
				},
			})
		}

export const makePlaylistPublic =
	resolver<Playlist, PlaylistID>(
		async ({ args, context }) => {
			const playlist =
				await handlePlaylistPublicValue(context.pg)({
					isPublic: true,
					playlistID: args.playlistID,
					userID: context.authorization!.userID,
				})
			await context.ag.saveObject({
				text: playlist.title,
				typeName: "Playlist",
				objectID: playlist.playlistID,
			})
			return playlist
		},
	)

export const makePlaylistPrivate =
	resolver<Playlist, PlaylistID>(
		async ({ args, context }) => {
			await context.ag.deleteObject(args.playlistID)
			return handlePlaylistPublicValue(context.pg)({
				isPublic: false,
				playlistID: args.playlistID,
				userID: context.authorization!.userID,
			})
		},
	)