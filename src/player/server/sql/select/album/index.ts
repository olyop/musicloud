import importSQL from "../../import-sql"

const importFile =
	importSQL("select")("album")

export const SELECT_ALBUM_BY_ID = importFile("by-id")
export const SELECT_ALBUM_PLAYS = importFile("plays")
export const SELECT_ALBUM_SONGS = importFile("songs")
export const SELECT_ALBUM_GENRES = importFile("genres")
export const SELECT_ALBUM_ARTISTS = importFile("artists")
export const SELECT_ALBUMS_TRENDING = importFile("trending")