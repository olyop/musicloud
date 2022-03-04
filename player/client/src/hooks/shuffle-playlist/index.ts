import { useEffect } from "react"
import { PlaylistID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_PLAYLIST from "./shuffle-playlist.gql"
import { updatePlay, useDispatch } from "../../redux"

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
			() => {
				resetPlayer()
				void shufflePlaylist()
			}

		useEffect(() => {
			if (result.data) {
				dispatch(updatePlay(true))
			}
		}, [result.data])

		return [ handleShufflePlaylist, result ] as const
	}

interface Data {
	shufflePlaylist: QueueNowPlaying,
}