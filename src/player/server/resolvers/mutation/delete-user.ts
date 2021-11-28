import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NAME } from "@oly_op/music-app-common/metadata"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { query as pgHelpersQuery } from "@oly_op/pg-helpers"

import {
	DELETE_USER_BY_ID,
	DELETE_LIBRARY_SONGS,
	DELETE_USER_PLAYLISTS,
	DELETE_LIBRARY_ARTISTS,
	DELETE_LIBRARY_PLAYLISTS,
} from "../../sql"

import resolver from "./resolver"

export const deleteUser =
	resolver(
		async ({ context }) => {
			const query = pgHelpersQuery(context.pg)
			const { userID } = context.authorization!

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

			await context.ag.deleteObject(userID)
		},
	)