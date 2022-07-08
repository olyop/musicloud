import { PlaylistID } from "@oly_op/musicloud-common"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_PLAYLIST from "./shuffle-playlist.gql"

export const useShufflePlaylist =
	({ playlistID }: PlaylistID) => {
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

		return [ handleShufflePlaylist, result ] as const
	}

interface Data {
	shufflePlaylist: QueueNowPlaying,
}