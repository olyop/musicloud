import { exists } from "@oly_op/pg-helpers"
import { UserInputError } from "apollo-server-fastify"
import { SongIDBase } from "@oly_op/music-app-common/types"

import { User } from "../../types"
import { clearQueuesNowPlaying, createResolver, updateUserNowPlaying } from "../helpers"

const resolver =
	createResolver()

export const playSong =
	resolver<User, SongIDBase>(
		async ({ args, context }) => {
			const { songID } = args
			const { userID } = context.authorization!

			const songExists =
				await exists(context.pg)({
					value: songID,
					table: "songs",
					column: "song_id",
				})

			if (!songExists) {
				throw new UserInputError("Song does not exist.")
			}

			await clearQueuesNowPlaying(context.pg)(userID)

			return updateUserNowPlaying(context.pg)(userID, songID)
		},
	)