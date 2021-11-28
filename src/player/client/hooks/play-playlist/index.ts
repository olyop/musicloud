import isNull from "lodash/isNull"
import isUndefined from "lodash/isUndefined"
import { MutationResult } from "@apollo/client"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import { useQuery } from "../query"
import { useMutation } from "../mutation"
import PLAY_PLAYLIST from "./play-playlist.gql"
import { useResetPlayer } from "../reset-player"
import { Handler, QueueNowPlaying } from "../../types"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"
import { useDispatch, updatePlay, togglePlay, useStatePlay } from "../../redux"

export const usePlayPlaylist =
	({ playlistID }: PlaylistIDBase) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playPlaylist, result ] =
			useMutation<PlayPlaylistData, PlaylistIDBase>(PLAY_PLAYLIST, {
				variables: { playlistID },
			})

		const { data } =
			useQuery<GetQueueNowPlayingData, PlaylistIDBase>(GET_QUEUE_NOW_PLAYING, {
				variables: { playlistID },
				fetchPolicy: "cache-first",
			})

		const isNowPlaying = (
			!isUndefined(data) &&
			!isNull(data.getQueue.nowPlaying) &&
			data.getQueue.nowPlaying.isInPlaylist
		)

		const handlePlayPlaylist =
			async () => {
				if (!result.loading) {
					if (isNowPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						await playPlaylist()
						dispatch(updatePlay(true))
					}
				}
			}

		return [ handlePlayPlaylist, isNowPlaying, result ] as UsePlayPlaylistResult
	}

type UsePlayPlaylistResult = [
	playPlaylist: Handler,
	isPlaying: boolean,
	result: MutationResult<PlayPlaylistData>,
]

interface PlayPlaylistData {
	playPlaylist: QueueNowPlaying,
}

interface GetQueueNowPlayingData {
	getQueue: QueueNowPlaying,
}