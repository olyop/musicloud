import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NAME } from "@oly_op/musicloud-common/build/metadata";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { exists, importSQL, query as pgHelpersQuery } from "@oly_op/pg-helpers";
import { removeDashesFromUUID } from "@oly_op/uuid-dashes";

import resolver from "../resolver";

const isf = importSQL(import.meta.url);

const DELETE_LIBRARY_ARTISTS = await isf("delete-library-artists");
const DELETE_LIBRARY_PLAYLISTS = await isf("delete-library-playlists");
const DELETE_LIBRARY_SONGS = await isf("delete-library-songs");
const DELETE_USER_BY_ID = await isf("delete-by-id");
const DELETE_USER_PLAYLISTS = await isf("delete-playlists");

export const deleteUser = resolver(async ({ context }) => {
	const query = pgHelpersQuery(context.pg);
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const userExists = await exists(context.pg)({
		value: userID,
		table: "users",
		column: COLUMN_NAMES.USER[0],
	});

	if (!userExists) {
		throw new Error("User does not exist");
	}

	const variables = { userID };

	await query(DELETE_LIBRARY_SONGS)({ variables });
	await query(DELETE_LIBRARY_ARTISTS)({ variables });
	await query(DELETE_LIBRARY_PLAYLISTS)({ variables });
	await query(DELETE_USER_PLAYLISTS)({ variables });
	await query(DELETE_USER_BY_ID)({ variables });

	await context.s3.send(
		new DeleteObjectCommand({
			Bucket: NAME,
			Key: `catalog/${removeDashesFromUUID(userID)}`,
		}),
	);

	await context.ag.index.deleteObject(userID);
});
