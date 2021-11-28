import isNull from "lodash/isNull"
import { Reference } from "@apollo/client"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import { DeletePlaylistUpdate } from "./types"

const update =
	({ playlistID }: PlaylistIDBase): DeletePlaylistUpdate =>
		cache => {
			cache.modify({
				id: cache.identify({ __typename: "Library" }),
				fields: {
					playlistsPaginated:
						(existing: Reference[] | null, { readField }) => {
							if (isNull(existing)) {
								return null
							} else {
								if (existing.length === 1) {
									return null
								} else {
									return existing.filter(playlist => (
										readField("playlistID", playlist) !== playlistID
									))
								}
							}
						},
				},
			})
		}

export default update