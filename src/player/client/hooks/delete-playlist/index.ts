import { MutationResult, StoreObject } from "@apollo/client"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { getUserID } from "../../helpers"
import { User, Handler } from "../../types"
import DELETE_PLAYLIST from "./delete-playlist.gql"

export const useDeletePlaylist =
	(playlistID: string) => {
		const [ deletePlaylist, result ] =
			useMutation<Data, PlaylistIDBase>(DELETE_PLAYLIST, {
				variables: { playlistID },
				update: (cache, { data }) => {
					cache.modify({
						id: cache.identify({
							__typename: "User",
							userID: getUserID(),
						}),
						fields: {
							libraryPlaylists:
								(existing: StoreObject[], { readField }) =>
									existing.filter(playlist => (
										readField("playlistID", playlist) !== playlistID
									)),
						},
					})
				},
			})

		const handler =
			async () => {
				await deletePlaylist()
			}

		return [
			handler,
			result,
		] as [
			handler: Handler,
			result: MutationResult<Data>,
		]
	}

interface Data {
	deletePlaylist: User,
}