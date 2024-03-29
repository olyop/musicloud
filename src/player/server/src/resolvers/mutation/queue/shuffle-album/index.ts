import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { AlbumID } from "@oly_op/musicloud-common/build/types";
import { exists, importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../../resolver.js";

const EXECUTE_SHUFFLE_ALBUM = await importSQL(import.meta.url)("execute-shuffle-album");

export const shuffleAlbum = resolver<Record<string, never>, AlbumID>(async ({ args, context }) => {
	const { albumID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const albumExists = await exists(context.pg)({
		value: albumID,
		table: "albums",
		column: COLUMN_NAMES.ALBUM[0],
	});

	if (!albumExists) {
		throw new Error("Album does not exist");
	}

	await query(context.pg)(EXECUTE_SHUFFLE_ALBUM)({
		variables: {
			userID,
			albumID,
		},
	});

	return {};
});
