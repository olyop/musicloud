import { MutationResult } from "@apollo/client"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { Playlist, User } from "../../types"
import RENAME_PLAYLIST from "./rename-playlist.gql"

export const useRenamePlaylist =
	(playlistID: string) => {
		const [ deletePlaylist, result ] =
			useMutation<Data, Vars>(RENAME_PLAYLIST)

		const handler =
			async (title: string) => {
				await deletePlaylist({
					variables: { playlistID, title },
				})
			}

		return [
			handler,
			result,
		] as [
			handler: (title: string) => Promise<void>,
			result: MutationResult<Data>,
		]
	}

interface Vars
	extends PlaylistIDBase, Pick<Playlist, "title"> {}

interface Data {
	deletePlaylist: User,
}