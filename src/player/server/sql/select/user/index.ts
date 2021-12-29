import importSQL from "../../import-sql"

const importFile =
	importSQL("select")("user")

export const SELECT_USER_BY_ID = importFile("by-id")
export const SELECT_USER_PLAYS = importFile("plays")
export const SELECT_USER_FOLLOWERS = importFile("followers")
export const SELECT_USER_PLAYLISTS = importFile("playlists")
export const SELECT_USER_SONG_PLAYS = importFile("song-plays")
export const SELECT_USER_ALBUM_PLAYS = importFile("album-plays")
export const SELECT_USER_NAME_PASSWORD = importFile("name-password")
export const SELECT_USER_PLAYLISTS_FILTERED = importFile("playlists-filtered")