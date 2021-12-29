import resolver from "./resolver"
import { IndexOptions } from "../../types"

export const jumpToSongInQueueNext =
	resolver<Record<string, never>, IndexOptions>(
		() => ({}),
	)