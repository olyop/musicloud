import { readFile } from "node:fs/promises"

export const INSERT_ARTIST =
	(await readFile(new URL("./insert-artist.sql", import.meta.url))).toString()

export const DELETE_ARTIST =
	(await readFile(new URL("./delete-artist.sql", import.meta.url))).toString()