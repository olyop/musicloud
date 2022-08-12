import { PlaylistID } from "@oly_op/musicloud-common/build/types"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import { useResetPlayer } from "../reset-player"
import { updateNowPlayingMutationFunction } from "../../helpers"

import SHUFFLE_PLAYLIST from "./shuffle-playlist.gql"

export const useShufflePlaylist =
	({ playlistID }: PlaylistID) => {
		const resetPlayer = useResetPlayer()

		const [ shufflePlaylist, result ] =
			useMutation<Data, PlaylistID>(SHUFFLE_PLAYLIST,	{
				variables: { playlistID },
				update: updateNowPlayingMutationFunction(({ shufflePlaylist: { nowPlaying } }) => nowPlaying),
			})

		const handler =
			() => {
				resetPlayer()
				void shufflePlaylist()
			}

		return [ handler, result ] as const
	}

interface Data {
	shufflePlaylist: QueueNowPlaying,
}