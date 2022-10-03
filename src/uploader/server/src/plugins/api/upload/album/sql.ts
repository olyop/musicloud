import { readFile } from "node:fs/promises"

export const SELECT_ARTIST =
	(await readFile(new URL("./select-artist.sql", import.meta.url))).toString()
export const SELECT_GENRE =
	(await readFile(new URL("./select-genre.sql", import.meta.url))).toString()

export const INSERT_ALBUM =
	(await readFile(new URL("./insert-album.sql", import.meta.url))).toString()
export const INSERT_ALBUM_ARTIST =
	(await readFile(new URL("./insert-album-artist.sql", import.meta.url))).toString()

export const INSERT_SONG =
	(await readFile(new URL("./insert-song.sql", import.meta.url))).toString()
export const INSERT_SONG_GENRE =
	(await readFile(new URL("./insert-song-genre.sql", import.meta.url))).toString()
export const INSERT_SONG_ARTIST =
	(await readFile(new URL("./insert-song-artist.sql", import.meta.url))).toString()
export const INSERT_SONG_REMIXER =
	(await readFile(new URL("./insert-song-remixer.sql", import.meta.url))).toString()
export const INSERT_SONG_FEATURE =
	(await readFile(new URL("./insert-song-feature.sql", import.meta.url))).toString()