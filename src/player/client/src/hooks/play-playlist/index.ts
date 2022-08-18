import { useEffect } from "react"
import isNull from "lodash-es/isNull"
import isUndefined from "lodash-es/isUndefined"
import { PlaylistID } from "@oly_op/musicloud-common/build/types"

import { useQuery } from "../query"
import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import { useResetPlayer } from "../reset-player"
import { updateNowPlayingMutationFunction } from "../../helpers"
import { useDispatch, togglePlay, updatePlay } from "../../redux"

import PLAY_PLAYLIST from "./play-playlist.gql"
import GET_PLAYLIST_NOW_PLAYING from "./get-playlist-now-playing.gql"

export const usePlayPlaylist =
	(playlist: PlaylistID | null) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playPlaylist, result ] =
			useMutation<PlayPlaylistData, PlaylistID>(PLAY_PLAYLIST, {
				update: updateNowPlayingMutationFunction(({ playPlaylist: { nowPlaying } }) => nowPlaying),
			})

		const { data } =
			useQuery<GetQueueNowPlayingData, PlaylistID>(GET_PLAYLIST_NOW_PLAYING, {
				fetchPolicy: "cache-first",
			})

		const isPlaylistNotNull =
			!isNull(playlist)

		const isNowPlaying = (
			isPlaylistNotNull &&
			!isUndefined(data) &&
			!isNull(data.getQueue.nowPlaying) &&
			data.getQueue.nowPlaying.isInPlaylist
		)

		const handlePlayPlaylist =
			() => {
				if (isPlaylistNotNull) {
					if (isNowPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						void playPlaylist({
							variables: { playlistID: playlist.playlistID	},
						})
					}
				}
			}

		useEffect(() => {
			if (result.data) {
				dispatch(updatePlay(true))
			}
		}, [result.data])

		return [ handlePlayPlaylist, isNowPlaying, result ] as const
	}

interface PlayPlaylistData {
	playPlaylist: QueueNowPlaying,
}

interface GetQueueNowPlayingData {
	getQueue: QueueNowPlaying,
}