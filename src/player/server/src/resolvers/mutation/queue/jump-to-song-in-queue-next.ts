import { IndexOptions } from "../../../types/index.js";
import resolver from "../resolver.js";

export const jumpToSongInQueueNext = resolver<Record<string, never>, IndexOptions>(() =>
	Promise.resolve({}),
);
