import { MutationResult } from "@apollo/client"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { getUserID } from "../../helpers"
import DELETE_PLAYLIST from "./delete-playlist.gql"
import { User, Handler, Playlist } from "../../types"

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
							libraryPlaylists: (existing: Playlist[]) =>
								existing.filter(playlist => playlist.playlistID === playlistID),
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