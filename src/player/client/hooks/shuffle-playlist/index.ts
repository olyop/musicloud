import { MutationResult } from "@apollo/client"
import { PlaylistID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_PLAYLIST from "./shuffle-playlist.gql"
import { updatePlay, useDispatch } from "../../redux"
import { HandlerPromise, QueueNowPlaying } from "../../types"

export const useShufflePlaylist =
	({ playlistID }: PlaylistID) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ shufflePlaylist, result ] =
			useMutation<Data, PlaylistID>(
				SHUFFLE_PLAYLIST,
				{ variables: { playlistID } },
			)

		const handleShufflePlaylist =
			async () => {
				resetPlayer()
				await shufflePlaylist()
				dispatch(updatePlay(true))
			}

		return [ handleShufflePlaylist, result ] as Result
	}

interface Data {
	shufflePlaylist: QueueNowPlaying,
}

type Result = [
	shufflePlaylist: HandlerPromise,
	result: MutationResult<Data>,
]