import importSQL from "../../import-sql"

const importFile =
	importSQL("select")("play")

export const SELECT_PLAY_BY_ID = importFile("by-id")