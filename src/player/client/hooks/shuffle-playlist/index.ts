import { MutationResult } from "@apollo/client"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_PLAYLIST from "./shuffle-playlist.gql"
import { useDispatch, updatePlay } from "../../redux"
import { Handler, QueueNowPlaying } from "../../types"

export const useShufflePlaylist =
	({ playlistID }: PlaylistIDBase) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ shufflePlaylist, result ] =
			useMutation<ShufflePlaylistData, PlaylistIDBase>(
				SHUFFLE_PLAYLIST,
				{ variables: { playlistID } },
			)

		const handleShufflePlaylist =
			async () => {
				resetPlayer()
				await shufflePlaylist()
				dispatch(updatePlay(true))
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