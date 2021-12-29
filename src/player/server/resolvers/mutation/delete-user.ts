import { UserInputError } from "apollo-server-fastify"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NAME } from "@oly_op/music-app-common/metadata"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { exists, query as pgHelpersQuery } from "@oly_op/pg-helpers"

import {
	DELETE_USER_BY_ID,
	DELETE_LIBRARY_SONGS,
	DELETE_USER_PLAYLISTS,
	DELETE_LIBRARY_ARTISTS,
	DELETE_LIBRARY_PLAYLISTS,
} from "../../sql"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"

export const deleteUser =
	resolver(
		async ({ context }) => {
			const query = pgHelpersQuery(context.pg)
			const { userID } = context.authorization!

			const userExists =
				await exists(context.pg)({
					value: userID,
					table: "users",
					column: COLUMN_NAMES.USER[0],
				})

			if (!userExists) {
				throw new UserInputError("User does not exist")
			}

			const variables = { userID }

			await query(DELETE_LIBRARY_SONGS)({ variables })
			await query(DELETE_LIBRARY_ARTISTS)({ variables })
			await query(DELETE_LIBRARY_PLAYLISTS)({ variables })
			await query(DELETE_USER_PLAYLISTS)({ variables })
			await query(DELETE_USER_BY_ID)({ variables })

			await context.s3.send(
				new DeleteObjectCommand({
					Bucket: NAME,
					Key: `catalog/${removeDashesFromUUID(userID)}`,
				}),
			)

			await context.ag.index.deleteObject(userID)
		},
	)