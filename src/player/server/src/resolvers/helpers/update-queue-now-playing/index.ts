import { UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, importSQL, query } from "@oly_op/pg-helpers";
import { SearchIndex } from "algoliasearch";

import incrementPlays from "./increment-plays";

const EXECUTE_UPDATE_NOW_PLAYING = await importSQL(import.meta.url)("execute-update-now-playing");

export interface UpdateQueueNowPlayingOptions extends UserID {
	value: string | null;
}

export const updateQueueNowPlaying =
	(pg: PoolOrClient, ag?: SearchIndex) => async (options: UpdateQueueNowPlayingOptions) => {
		const { userID, value: songID } = options;

		await query(pg)(EXECUTE_UPDATE_NOW_PLAYING)({
			variables: {
				userID,
				songID,
			},
		});

		if (ag && songID) {
			void incrementPlays(
				pg,
				ag,
			)({
				songID,
				userID,
			});
		}
	};
