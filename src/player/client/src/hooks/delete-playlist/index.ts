import { PlaylistID } from "@oly_op/musicloud-common/build/types"

import { useMutation } from "../mutation"

import DELETE_PLAYLIST from "./delete-playlist.gql"

export const useDeletePlaylist =
	({ playlistID }: PlaylistID) => {
		const [ deletePlaylist, result ] =
			useMutation<Data, PlaylistID>(DELETE_PLAYLIST, {
				variables: { playlistID },
			})

		const handleDeletePlaylist =
			() => {
				void deletePlaylist()
			}

		return [ handleDeletePlaylist, result ] as const
	}

export interface Data {
	deletePlaylistByID: null,
}