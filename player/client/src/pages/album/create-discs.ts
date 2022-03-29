import { isEmpty } from "lodash-es"

import { Song, Disc } from "../../types"

const createDiscs =
	(songs: Song[]) => {
		if (isEmpty(songs)) {
			return []
		} else {
			const numberOfDiscs =
				songs[songs.length - 1]!.discNumber || 1

			const discsEmpty =
				[ ...Array<Disc>(numberOfDiscs) ]

			const discs =
				discsEmpty.map(
					(disc, index) => ({
						hideLabel: false,
						index: index + 1,
						songs: songs.filter(({ discNumber }) => discNumber === index + 1),
					}),
				)

			if (discs.length === 1) {
				return discs.map(disc => ({ ...disc, hideLabel: true }))
			} else {
				return discs
			}
		}
	}

export default createDiscs