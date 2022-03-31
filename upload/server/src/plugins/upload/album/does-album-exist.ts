import { Pool } from "pg"

import { List } from "./types"

export const doesAlbumExist =
	(pg: Pool) =>
		async (title: string, albumArtists: List) => {
			console.log({ title, albumArtists, pg })
			return false
		}