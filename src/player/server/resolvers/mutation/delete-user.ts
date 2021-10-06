import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NAME } from "@oly_op/music-app-common/metadata"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { UserIDBase } from "@oly_op/music-app-common/types"
import { query as pgQuery, VariableType } from "@oly_op/pg-helpers"

import {
	DELETE_USER_BY_ID,
	DELETE_LIBRARY_SONGS,
	DELETE_USER_PLAYLISTS,
	DELETE_LIBRARY_ARTISTS,
	DELETE_LIBRARY_PLAYLISTS,
} from "../../sql"

import { createResolver } from "../helpers"

interface Vars
	extends UserIDBase, Record<string, VariableType> {}

const resolver =
	createResolver()

export const deleteUser =
	resolver(
		async ({ context }) => {
			const query = pgQuery(context.pg)
			const { userID } = context.authorization!

			const variables: Vars =
				{ userID }

			await query(DELETE_USER_PLAYLISTS)({ variables })
			await query(DELETE_LIBRARY_SONGS)({ variables })
			await query(DELETE_LIBRARY_ARTISTS)({ variables })
			await query(DELETE_LIBRARY_PLAYLISTS)({ variables })
			await query(DELETE_USER_BY_ID)({ variables })

			await context.s3.send(new DeleteObjectCommand({
				Bucket: NAME,
				Key: `catalog/${removeDashesFromUUID(userID)}`,
			}))

			await context.ag.deleteObject(userID)
		},
	)