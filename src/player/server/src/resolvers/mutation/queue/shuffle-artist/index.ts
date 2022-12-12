import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { ArtistID } from "@oly_op/musicloud-common/build/types";
import { exists, importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../../resolver";

const EXECUTE_SHUFFLE_ARTIST = await importSQL(import.meta.url)("execute-shuffle-artist");

export const shuffleArtist = resolver<Record<string, never>, ArtistID>(
	async ({ args, context }) => {
		const { artistID } = args;
		const { userID } = context.getAuthorizationJWTPayload(context.authorization);

		const artistExists = await exists(context.pg)({
			value: artistID,
			table: "artists",
			column: COLUMN_NAMES.ARTIST[0],
		});

		if (!artistExists) {
			throw new Error("Artist does not exist");
		}

		await query(context.pg)(EXECUTE_SHUFFLE_ARTIST)({
			variables: {
				userID,
				artistID,
			},
		});

		return {};
	},
);
