import { exists } from "@oly_op/pg-helpers"
import { SongID } from "@oly_op/musicloud-common/build/types"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { updateQueueNowPlaying } from "../helpers/update-queue-now-playing"

export const playSong =
	resolver<Record<string, never>, SongID>(
		async ({ args, context }) => {
			const { songID } = args
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)

			const songExists =
				await exists(context.pg)({
					value: songID,
					table: "songs",
					column: COLUMN_NAMES.SONG[0],
				})

			if (!songExists) {
				throw new Error("Song does not exist")
			}

			await updateQueueNowPlaying(context.pg, context.ag.index)({
				userID,
				value: songID,
			})

			return {}
		},
	)