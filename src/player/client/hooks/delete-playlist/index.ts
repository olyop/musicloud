import isNull from "lodash/isNull"
import { Reference } from "@apollo/client"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import DELETE_PLAYLIST from "./delete-playlist.gql"
import { DeletePlaylistData, UseDeletePlaylistResult } from "./types"

export const useDeletePlaylist =
	({ playlistID }: PlaylistIDBase): UseDeletePlaylistResult => {
		const [ deletePlaylist, result ] =
			useMutation<DeletePlaylistData, PlaylistIDBase>(DELETE_PLAYLIST, {
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

		return [ handleDeletePlaylist, result ]
	}