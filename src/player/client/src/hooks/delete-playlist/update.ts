import isNull from "lodash-es/isNull"
import { Reference } from "@apollo/client"
import { PlaylistID } from "@oly_op/musicloud-common/build/types"

import { Update } from "./types"

const update =
	({ playlistID }: PlaylistID): Update =>
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