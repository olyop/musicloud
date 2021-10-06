import importSQL from "../../import-sql"

const importFile = importSQL("delete")("library")

export const DELETE_LIBRARY_SONGS = importFile("songs")
export const DELETE_LIBRARY_ARTISTS = importFile("artists")
export const DELETE_LIBRARY_PLAYLISTS = importFile("playlists")