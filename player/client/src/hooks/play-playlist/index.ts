import { isNull, isUndefined } from "lodash-es"
import { PlaylistID } from "@oly_op/musicloud-common"

import { useQuery } from "../query"
import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import PLAY_PLAYLIST from "./play-playlist.gql"
import { useResetPlayer } from "../reset-player"
import { useDispatch, togglePlay } from "../../redux"
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
			() => {
				if (!result.loading) {
					if (isNowPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						void playPlaylist()
					}
				}
			}

		return [ handlePlayPlaylist, isNowPlaying, result ] as const
	}

interface Data {
	playPlaylist: QueueNowPlaying,
}

interface QueryData {
	getQueue: QueueNowPlaying,
}