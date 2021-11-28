import importSql from "../import-sql"

const importFile = importSql("insert")()

export const INSERT_PLAY = importFile("play")
export const INSERT_PLAYLIST = importFile("playlist")
export const INSERT_QUEUE_SONG = importFile("queue-song")
export const INSERT_NOW_PLAYING = importFile("now-playing")
export const INSERT_PLAYLIST_SONG = importFile("playlist-song")
export const INSERT_LIBRARY_OBJECT = importFile("library-object")