import isNull from "lodash/isNull"

import { CreatePlaylistUpdate, PlaylistDataPick, CreatePlaylistModifer } from "./types"

const modifer =
	(playlist: PlaylistDataPick): CreatePlaylistModifer =>
		(existing, { toReference }) => {
			if (isNull(existing)) {
				return [ playlist ]
			} else {
				return [ ...existing, playlist ]
			}
		}

const update: CreatePlaylistUpdate =
	(cache, { data }) => {
		cache.modify({
			id: cache.identify({ __typename: "Library" }),
			fields: {
				playlistsPaginated: modifer(data!.createPlaylist),
			},
		})
	}

export default update