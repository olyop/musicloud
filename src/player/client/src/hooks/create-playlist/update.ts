import isNull from "lodash-es/isNull"

import { Update, PlaylistDataPick, Modifer } from "./types"

const modifer =
	(playlist: PlaylistDataPick): Modifer =>
		existing => {
			if (isNull(existing)) {
				return [ playlist ]
			} else {
				return [ ...existing, playlist ]
			}
		}

const update: Update =
	(cache, { data }) => {
		cache.modify({
			id: cache.identify({ __typename: "Library" }),
			fields: {
				playlistsPaginated: modifer(data!.createPlaylist),
			},
		})
	}

export default update