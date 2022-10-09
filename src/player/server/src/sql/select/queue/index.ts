import importSQL from "../../import-sql";

const importFile = importSQL("select")("queue");

export const SELECT_QUEUE = importFile("all");
export const SELECT_QUEUE_SONG = importFile("song");
export const SELECT_QUEUE_SONGS = importFile("songs");
export const SELECT_QUEUE_NOW_PLAYING = importFile("now-playing");
export const SELECT_QUEUE_SONGS_FROM_IDS = importFile("songs-from-ids");
export const SELECT_QUEUE_NOW_PLAYING_SONG = importFile("now-playing-song");
