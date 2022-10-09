import { query as pgHelpersQuery } from "@oly_op/pg-helpers";

import { DELETE_LIBRARY_SONGS, DELETE_LIBRARY_ARTISTS, DELETE_LIBRARY_PLAYLISTS } from "../../sql";

import resolver from "./resolver";

export const deleteLibrary = resolver(async ({ context }) => {
	const query = pgHelpersQuery(context.pg);
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const variables = { userID };

	await Promise.all([
		query(DELETE_LIBRARY_SONGS)({ variables }),
		query(DELETE_LIBRARY_ARTISTS)({ variables }),
		query(DELETE_LIBRARY_PLAYLISTS)({ variables }),
	]);
});
