import importSql from "../import-sql"

const importFile = importSql("update")()

export const UPDATE_QUEUE_SONG = importFile("queue-song")
export const UPDATE_PLAYLIST_TITLE = importFile("playlist-title")
export const UPDATE_QUEUE_NOW_PLAYING = importFile("queue-now-playing")
export const UPDATE_OBJECT_IN_LIBRARY = importFile("object-in-library")