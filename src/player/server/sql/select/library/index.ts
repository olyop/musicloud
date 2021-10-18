import importSQL from "../../import-sql"

const importFile = importSQL("select")("library")

export const SELECT_LIBRARY_SONGS = importFile("songs")
export const SELECT_LIBRARY_GENRES = importFile("genres")
export const SELECT_LIBRARY_ALBUMS = importFile("albums")
export const SELECT_LIBRARY_ARTISTS = importFile("artists")
export const SELECT_LIBRARY_PLAYLISTS = importFile("playlists")
export const SELECT_LIBRARY_SONGS_PAGINATED = importFile("songs-paginated")
export const SELECT_LIBRARY_ALBUMS_PAGINATED = importFile("albums-paginated")
export const SELECT_LIBRARY_GENRES_PAGINATED = importFile("genres-paginated")
export const SELECT_LIBRARY_ARTISTS_PAGINATED = importFile("artists-paginated")
export const SELECT_LIBRARY_PLAYLISTS_PAGINATED = importFile("playlists-paginated")