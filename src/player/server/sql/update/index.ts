import importSql from "../import-sql"

const importFile = importSql("update")()

export const UPDATE_PLAYLIST_TITLE = importFile("playlist-title")
export const UPDATE_USER_QUEUE_SONG = importFile("user-queue-song")
export const UPDATE_USER_NOW_PLAYING = importFile("user-now-playing")
export const UPDATE_OBJECT_IN_LIBRARY = importFile("object-in-library")
export const UPDATE_USER_NOW_PLAYING_NULL = importFile("user-now-playing-null")