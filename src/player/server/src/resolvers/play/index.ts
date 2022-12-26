import { Play } from "../../types/index.js";
import createParentResolver from "../create-parent-resolver.js";
import {
	determineRedisPlaysKey,
	getSong,
	getUser,
	pgEpochToJS,
	redisHandler,
} from "../helpers/index.js";

const resolver = createParentResolver<Play>();

export const dateCreated = resolver(({ parent }) =>
	Promise.resolve(pgEpochToJS(parent.dateCreated)),
);

export const user = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisPlaysKey(parent.playID, "user"), () =>
		getUser(context.pg)({
			userID: parent.userID,
		}),
	),
);

export const song = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisPlaysKey(parent.playID, "song"), () =>
		getSong(context.pg)({
			songID: parent.songID,
		}),
	),
);
