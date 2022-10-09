import importSQL from "../../import-sql";

const importFile = importSQL("delete")("playlist");

export const DELETE_PLAYLIST_SONG = importFile("song");
export const DELETE_PLAYLIST_BY_ID = importFile("by-id");
