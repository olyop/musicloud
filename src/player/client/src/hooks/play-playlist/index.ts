import { useEffect } from "react"
import { useLazyQuery } from "@apollo/client"
import { isNull, isUndefined } from "lodash-es"
import { PlaylistID } from "@oly_op/musicloud-common"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import PLAY_PLAYLIST from "./play-playlist.gql"
import { useResetPlayer } from "../reset-player"
import { useDispatch, togglePlay } from "../../redux"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"

export const usePlayPlaylist =
	(playlist: PlaylistID | null) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playPlaylist, result ] =
			useMutation<Data, PlaylistID>(PLAY_PLAYLIST)

		const [ getQueueNowPlaying, { data, called } ] =
			useLazyQuery<QueryData, PlaylistID>(GET_QUEUE_NOW_PLAYING, {
				fetchPolicy: "cache-first",
			})

		const isNowPlaying = (
			!isNull(playlist) &&
			!isUndefined(data) &&
			!isNull(data.getQueue.nowPlaying) &&
			data.getQueue.nowPlaying.isInPlaylist
		)

		const handlePlayPlaylist =
			() => {
				if (playlist && !result.loading) {
					if (isNowPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						void playPlaylist({
							variables: {
								playlistID: playlist.playlistID,
							},
						})
					}
				}
			}

		useEffect(() => {
			if (!isNull(playlist) && !called) {
				void getQueueNowPlaying({
					variables: {
						playlistID: playlist.playlistID,
					},
				})
			}
		}, [playlist])

		return [ handlePlayPlaylist, isNowPlaying, result ] as const
	}

interface Data {
	playPlaylist: QueueNowPlaying,
}

interface QueryData {
	getQueue: QueueNowPlaying,
}