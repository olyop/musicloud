import createParentResolver from "../create-parent-resolver.js";
import { getQueueNowPlayingSong, getQueueSongs } from "../helpers/index.js";

const QUEUE_PAGE_SIZE = 100;

const resolver = createParentResolver();

export const previous = resolver(({ context }) =>
	getQueueSongs(context.pg)({
		limit: QUEUE_PAGE_SIZE,
		tableName: "queue_previous",
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);

export const nowPlaying = resolver(({ context }) =>
	getQueueNowPlayingSong(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);

export const next = resolver(({ context }) =>
	getQueueSongs(context.pg)({
		limit: QUEUE_PAGE_SIZE,
		tableName: "queue_nexts",
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);

export const later = resolver(({ context }) =>
	getQueueSongs(context.pg)({
		limit: QUEUE_PAGE_SIZE,
		tableName: "queue_laters",
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);
