import importSQL from "../../import-sql";

const importFile = importSQL("select")("song");

export const SELECT_SONGS = importFile("all");
export const SELECT_SONGS_IN = importFile("in");
export const SELECT_SONG_BY_ID = importFile("by-id");
export const SELECT_SONG_PLAYS = importFile("plays");
export const SELECT_SONG_GENRES = importFile("genres");
export const SELECT_SONG_ARTISTS = importFile("artists");
export const SELECT_SONG_REMIXERS = importFile("remixers");
export const SELECT_SONG_FEATURING = importFile("featuring");
export const SELECT_SONGS_TOP_PLAYED = importFile("top-played");
