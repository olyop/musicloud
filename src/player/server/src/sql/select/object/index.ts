import importSQL from "../../import-sql";

const importFile = importSQL("select")("object");

export const SELECT_OBJECT_SONG_PLAYS = importFile("song-plays");
export const SELECT_OBJECT_LIBRARY_DATE_ADDED = importFile("date-added");
