import { sum, isEmpty } from "lodash"

import { Song } from "../../types"

export const getSongsDurationOrNull =
	(songs: Song[]) =>
		(isEmpty(songs) ?
			null :
			sum(songs.map(({ duration }) => duration))
		)