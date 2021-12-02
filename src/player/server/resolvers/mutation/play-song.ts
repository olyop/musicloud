import { exists } from "@oly_op/pg-helpers"
import { UserInputError } from "apollo-server-fastify"
import { SongID } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { clearQueue, updateQueueNowPlaying } from "../helpers"

export const playSong =
	resolver<Record<string, never>, SongID>(
		async ({ args, context }) => {
			const { songID } = args
			const { userID } = context.authorization!

			const songExists =
				await exists(context.pg)({
					value: songID,
					table: "songs",
					column: COLUMN_NAMES.SONG[0],
				})

			if (!songExists) {
				throw new UserInputError("Song does not exist")
			}

			await clearQueue(context.pg)({ userID })

			await updateQueueNowPlaying(context.pg)({
				userID,
				value: songID,
			})

			return {}
		},
	)