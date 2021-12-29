import importSql from "../import-sql"

const importFile = importSql("insert")()

export const INSERT_PLAY = importFile("play")
export const INSERT_PLAYLIST = importFile("playlist")
export const INSERT_QUEUE_SONG = importFile("queue-song")
export const INSERT_NOW_PLAYING = importFile("now-playing")
export const INSERT_USER_FOLLOWER = importFile("user-follower")
export const INSERT_PLAYLIST_SONG = importFile("playlist-song")
export const INSERT_LIBRARY_OBJECT = importFile("library-object")
export const INSERT_ALGOLIA_API_KEY = importFile("algolia-api-key")