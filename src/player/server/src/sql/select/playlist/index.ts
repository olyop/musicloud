import importSQL from "../../import-sql";

const importFile = importSQL("select")("playlist");

export const SELECT_PLAYLIST_SONG = importFile("song");
export const SELECT_PLAYLIST_BY_ID = importFile("by-id");
export const SELECT_PLAYLIST_SONGS = importFile("songs");
export const SELECT_PLAYLISTS_TRENDING = importFile("trending");
export const SELECT_PLAYLIST_SONGS_RELATIONS = importFile("songs-relations");
