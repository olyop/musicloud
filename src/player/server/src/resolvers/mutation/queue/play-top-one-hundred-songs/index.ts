import { importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../../resolver";

const EXECUTE_PLAY_TOP_ONE_HUNDRED_SONGS = await importSQL(import.meta.url)(
	"execute-play-top-one-hundred-songs",
);

export const playTopOneHundredSongs = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	await query(context.pg)(EXECUTE_PLAY_TOP_ONE_HUNDRED_SONGS)({
		variables: { userID },
	});

	return {};
});
