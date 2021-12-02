import { MutationResult } from "@apollo/client"
import { PlaylistID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_PLAYLIST from "./shuffle-playlist.gql"
import { Handler, QueueNowPlaying } from "../../types"

export const useShufflePlaylist =
	({ playlistID }: PlaylistID) => {
		const resetPlayer = useResetPlayer()

		const [ shufflePlaylist, result ] =
			useMutation<ShufflePlaylistData, PlaylistID>(
				SHUFFLE_PLAYLIST,
				{ variables: { playlistID } },
			)

		const handleShufflePlaylist =
			async () => {
				resetPlayer()
				await shufflePlaylist()
			}

		return [ handleShufflePlaylist, result ] as UseShufflePlaylistResult
	}

type UseShufflePlaylistResult = [
	shufflePlaylist: Handler,
	result: MutationResult<ShufflePlaylistData>,
]

interface ShufflePlaylistData {
	shufflePlaylist: QueueNowPlaying,
}