import { UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, importSQL, query } from "@oly_op/pg-helpers";
import { SearchIndex } from "algoliasearch";

import { incrementAlgoliaPlays } from "./increment-algolia-plays";

const INSERT_PLAY = await importSQL(import.meta.url)("insert-play");
const EXECUTE_HANDLE_NOW_PLAYING = await importSQL(import.meta.url)("execute-handle-now-playing");

export const updateQueueNowPlaying =
	(pg: PoolOrClient, ag?: SearchIndex) => async (options: UpdateQueueNowPlayingOptions) => {
		const { userID, value: songID } = options;

		await query(pg)(EXECUTE_HANDLE_NOW_PLAYING)({
			variables: {
				userID,
				songID,
			},
		});

		await query(pg)(INSERT_PLAY)({
			variables: { userID, songID },
		});

		if (ag && songID) {
			await incrementAlgoliaPlays(
				pg,
				ag,
			)({
				songID,
			}).catch(console.error);
		}
	};

export interface UpdateQueueNowPlayingOptions extends UserID {
	value: string | null;
}
