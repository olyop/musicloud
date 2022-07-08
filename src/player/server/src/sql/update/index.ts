import importSql from "../import-sql"

const importFile = importSql("update")()

export const UPDATE_USER_PASSWORD = importFile("user-password")
export const UPDATE_PLAYLIST_TITLE = importFile("playlist-title")
export const UPDATE_QUEUE_SONG_INDEX = importFile("queue-song-index")
export const UPDATE_PLAYLIST_PRIVACY = importFile("playlist-privacy")
export const UPDATE_QUEUE_NOW_PLAYING = importFile("queue-now-playing")
export const UPDATE_OBJECT_IN_LIBRARY = importFile("object-in-library")
export const UPDATE_QUEUE_SONG_CREMENT_INDEX = importFile("queue-song-crement-index")