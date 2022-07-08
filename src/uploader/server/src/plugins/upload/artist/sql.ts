import { readFile } from "node:fs/promises"

export const INSERT_ARTIST =
	(await readFile(new URL("./insert-artist.sql", import.meta.url))).toString()