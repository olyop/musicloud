import { MutationResult } from "@apollo/client"
import { PlaylistID } from "@oly_op/music-app-common/types"

import { Handler, Playlist } from "../../types"
import { useMutation } from "../mutation"
import MAKE_PLAYLIST_PUBLIC from "./make-playlist-public.gql"
import MAKE_PLAYLIST_PRIVATE from "./make-playlist-private.gql"

type Result = [
	togglePlaylistPublic: Handler,
	result: MutationResult<unknown>,
]

export const useTogglePlaylistPublic =
	({ playlistID, isPublic }: Playlist): Result => {
		const [ mutate, result ] =
			useMutation<unknown, PlaylistID>(
				isPublic ? MAKE_PLAYLIST_PRIVATE : MAKE_PLAYLIST_PUBLIC,
				{ variables: { playlistID } },
			)

		const handleTogglePlaylistPublic =
			async () => {
				await mutate()
			}

		return [ handleTogglePlaylistPublic, result ]
	}