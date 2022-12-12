import { importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../../resolver";

const EXECUTE_SHUFFLE_TOP_ONE_HUNDRED_SONGS = await importSQL(import.meta.url)(
	"execute-shuffle-top-one-hundred-songs",
);

export const shuffleTopOneHundredSongs = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	await query(context.pg)(EXECUTE_SHUFFLE_TOP_ONE_HUNDRED_SONGS)({
		variables: { userID },
	});

	return {};
});
