import importSQL from "../../import-sql"

const importFile =
	importSQL("select")("genre")

export const SELECT_GENRE_BY_ID = importFile("by-id")
export const SELECT_GENRE_SONGS = importFile("songs")