import importSQL from "../../import-sql";

const importFile = importSQL("select")("library");

export const SELECT_LIBRARY_SONGS = importFile("songs");
export const SELECT_LIBRARY_GENRES = importFile("genres");
export const SELECT_LIBRARY_ALBUMS = importFile("albums");
export const SELECT_LIBRARY_ARTISTS = importFile("artists");
export const SELECT_LIBRARY_PLAYLISTS = importFile("playlists");
export const SELECT_LIBRARY_SONGS_TOTAL = importFile("songs-total");
export const SELECT_LIBRARY_ALBUMS_TOTAL = importFile("albums-total");
export const SELECT_LIBRARY_GENRES_TOTAL = importFile("genres-total");
export const SELECT_LIBRARY_SONG_AT_INDEX = importFile("song-at-index");
export const SELECT_LIBRARY_GENRE_AT_INDEX = importFile("genre-at-index");
export const SELECT_LIBRARY_ALBUM_AT_INDEX = importFile("album-at-index");
export const SELECT_LIBRARY_ARTIST_AT_INDEX = importFile("artist-at-index");
export const SELECT_LIBRARY_PLAYLIST_AT_INDEX = importFile("playlist-at-index");
