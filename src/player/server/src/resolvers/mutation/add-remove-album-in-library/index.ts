import { AlbumID } from "@oly_op/musicloud-common/build/types";
import { importSQL, query } from "@oly_op/pg-helpers";

import { Album } from "../../../types/index.js";
import { getAlbum } from "../../helpers/index.js";
import resolver from "../resolver.js";

const isf = importSQL(import.meta.url);

const EXECUTE_HANDLE_ALBUM_IN_LIBRARY = await isf("execute-handle-album-in-library");

export const addAlbumToLibrary = resolver<Album, AlbumID>(async ({ args, context }) => {
	const { albumID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	await query(context.pg)(EXECUTE_HANDLE_ALBUM_IN_LIBRARY)({
		variables: {
			albumID,
			userID,
			inLibrary: false,
		},
	});

	return getAlbum(context.pg)({ albumID });
});

export const removeAlbumFromLibrary = resolver<Album, AlbumID>(async ({ args, context }) => {
	const { albumID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	await query(context.pg)(EXECUTE_HANDLE_ALBUM_IN_LIBRARY)({
		variables: {
			albumID,
			userID,
			inLibrary: true,
		},
	});

	return getAlbum(context.pg)({ albumID });
});
