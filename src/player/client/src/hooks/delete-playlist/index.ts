import { isNull } from "lodash-es"
import { Reference } from "@apollo/client"
import { PlaylistID } from "@oly_op/musicloud-common"

import { useMutation } from "../mutation"
import { DeletePlaylistData } from "./types"
import DELETE_PLAYLIST from "./delete-playlist.gql"

export const useDeletePlaylist =
	({ playlistID }: PlaylistID) => {
		const [ deletePlaylist, result ] =
			useMutation<DeletePlaylistData, PlaylistID>(DELETE_PLAYLIST, {
				variables: { playlistID },
				update: cache => {
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
				},
			})

		const handleDeletePlaylist =
			async () => {
				await deletePlaylist()
			}

		return [ handleDeletePlaylist, result ] as const
	}