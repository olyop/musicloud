import { MutationResult } from "@apollo/client"
import { PlaylistID, InterfaceWithInput } from "@oly_op/music-app-common/types"

import { Playlist } from "../../types"
import { useMutation } from "../mutation"
import RENAME_PLAYLIST from "./rename-playlist.gql"

export const useRenamePlaylist =
	({ playlistID }: PlaylistID) => {
		const [ deletePlaylist, result ] =
			useMutation<RenamePlaylistData, Vars>(RENAME_PLAYLIST, {
				optimisticResponse: ({ input: { title } }) => ({
					renamePlaylist: {
						title,
						playlistID,
						__typename: "Playlist",
					},
				}),
			})

		const handleRenamePlaylist =
			async ({ title }: InputBase) => {
				await deletePlaylist({
					variables: { input: { playlistID, title } },
				})
			}

		return [ handleRenamePlaylist, result ] as UseRenamePlaylistResult
	}

type UseRenamePlaylistResult = [
	renamePlaylist: (input: InputBase) => Promise<void>,
	result: MutationResult<RenamePlaylistData>,
]

type InputBase =
	Pick<Playlist, "title">

interface Input
	extends PlaylistID, InputBase {}

type Vars =
	InterfaceWithInput<Input>

interface RenamePlaylistData {
	renamePlaylist: Pick<Playlist, "playlistID" | "__typename" | "title">,
}