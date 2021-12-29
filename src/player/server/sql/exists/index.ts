import importSql from "../import-sql"

const importFile = importSql("exists")()

export const EXISTS_ALBUM = importFile("album")
export const EXISTS_COLUMN = importFile("column")
export const EXISTS_QUEUE_SONG = importFile("queue-song")
export const EXISTS_ALBUM_SONG = importFile("album-song")
export const EXISTS_USER_FOLLOWER = importFile("user-follower")
export const EXISTS_PLAYLIST_SONG = importFile("playlist-song")
export const EXISTS_LIBRARY_OBJECT = importFile("library-object")
export const EXISTS_OBJECT_IN_LIBRARY = importFile("object-in-library")