import { importSQL } from "@oly_op/pg-helpers";

const isf = importSQL(import.meta.url);

export const SELECT_ARTIST = await isf("select-artist");
export const SELECT_GENRE = await isf("select-genre");

export const INSERT_ALBUM = await isf("insert-album");
export const INSERT_ALBUM_ARTIST = await isf("insert-album-artist");

export const INSERT_SONG = await isf("insert-song");
export const INSERT_SONG_GENRE = await isf("insert-song-genre");
export const INSERT_SONG_ARTIST = await isf("insert-song-artist");
export const INSERT_SONG_REMIXER = await isf("insert-song-remixer");
export const INSERT_SONG_FEATURE = await isf("insert-song-feature");
