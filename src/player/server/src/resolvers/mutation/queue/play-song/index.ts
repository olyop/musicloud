import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { SongID } from "@oly_op/musicloud-common/build/types";
import { exists } from "@oly_op/pg-helpers";

import { updateQueueNowPlaying } from "../../../helpers/index.js";
import resolver from "../../resolver.js";

export const playSong = resolver<Record<string, never>, SongID>(async ({ args, context }) => {
	const { songID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const songExists = await exists(context.pg)({
		value: songID,
		table: "songs",
		column: COLUMN_NAMES.SONG[0],
	});

	if (!songExists) {
		throw new Error("Song does not exist");
	}

	await updateQueueNowPlaying(
		context.pg,
		context.ag.index,
	)({
		userID,
		value: songID,
	});

	return {};
});
