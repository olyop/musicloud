import isNull from "lodash/isNull"
import isUndefined from "lodash/isUndefined"
import { MutationResult } from "@apollo/client"
import { PlaylistID } from "@oly_op/music-app-common/types"

import { useQuery } from "../query"
import { useMutation } from "../mutation"
import PLAY_PLAYLIST from "./play-playlist.gql"
import { useResetPlayer } from "../reset-player"
import { useDispatch, togglePlay, updatePlay } from "../../redux"
import { HandlerPromise, QueueNowPlaying } from "../../types"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"

export const usePlayPlaylist =
	({ playlistID }: PlaylistID) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playPlaylist, result ] =
			useMutation<Data, PlaylistID>(PLAY_PLAYLIST, {
				variables: { playlistID },
			})

		const { data } =
			useQuery<QueryData, PlaylistID>(GET_QUEUE_NOW_PLAYING, {
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

		return [ handlePlayPlaylist, isNowPlaying, result ] as Result
	}

type Result = [
	playPlaylist: HandlerPromise,
	isPlaying: boolean,
	result: MutationResult<Data>,
]

interface Data {
	playPlaylist: QueueNowPlaying,
}

interface QueryData {
	getQueue: QueueNowPlaying,
}