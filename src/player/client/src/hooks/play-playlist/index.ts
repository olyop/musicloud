import { useEffect } from "react"
import isNull from "lodash-es/isNull"
import { useLazyQuery } from "@apollo/client"
import isUndefined from "lodash-es/isUndefined"
import { PlaylistID } from "@oly_op/musicloud-common/build/types"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import PLAY_PLAYLIST from "./play-playlist.gql"
import { useResetPlayer } from "../reset-player"
import { useDispatch, togglePlay } from "../../redux"
import GET_PLAYLIST_NOW_PLAYING from "./get-playlist-now-playing.gql"

export const usePlayPlaylist =
	(playlist: PlaylistID | null) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playPlaylist, result ] =
			useMutation<MutationData, PlaylistID>(PLAY_PLAYLIST)

		const [ getQueueNowPlaying, { data, called } ] =
			useLazyQuery<QueryData, PlaylistID>(GET_PLAYLIST_NOW_PLAYING, {
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

interface MutationData {
	playPlaylist: QueueNowPlaying,
}

interface QueryData {
	getQueue: QueueNowPlaying,
}