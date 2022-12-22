import { IndexOptions } from "../../../types";
import resolver from "../resolver";

export const jumpToSongInQueueNext = resolver<Record<string, never>, IndexOptions>(() =>
	Promise.resolve({}),
);
