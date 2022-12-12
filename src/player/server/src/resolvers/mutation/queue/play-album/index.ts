import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { AlbumID } from "@oly_op/musicloud-common/build/types";
import { exists, importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../../resolver";

const EXECUTE_PLAY_ALBUM = await importSQL(import.meta.url)("execute-play-album");

export const playAlbum = resolver<Record<string, never>, AlbumID>(async ({ args, context }) => {
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

	await query(context.pg)(EXECUTE_PLAY_ALBUM)({
		variables: {
			userID,
			albumID,
		},
	});

	return {};
});
