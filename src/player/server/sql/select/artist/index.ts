import importSQL from "../../import-sql"

const importFile =
	importSQL("select")("artist")

export const SELECT_ARTIST_BY_ID = importFile("by-id")
export const SELECT_ARTIST_PLAYS = importFile("plays")
export const SELECT_ARTIST_SONGS = importFile("songs")
export const SELECT_ARTIST_ALBUMS = importFile("albums")
export const SELECT_ARTIST_TOP_TEN_SONGS = importFile("top-ten-songs")