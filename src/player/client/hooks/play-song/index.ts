import { useRef } from "react"
import isNull from "lodash/isNull"
import isUndefined from "lodash/isUndefined"
import { SongIDBase } from "@oly_op/music-app-common/types"

import update from "./update"
import { Song } from "../../types"
import { useQuery } from "../query"
import PLAY_SONG from "./play-song.gql"
import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"
import { togglePlay, updatePlay, useDispatch } from "../../redux"
import { GetQueueNowPlayingData, PlaySongData, UsePlaySongResult } from "./types"

export const usePlaySong =
	(song: Song) => {
		const { songID } = song
		const dispatch = useDispatch()
		const isOptimistic = useRef(true)
		const resetPlayer = useResetPlayer()
		const variables: SongIDBase = { songID }

		const { data } =
			useQuery<GetQueueNowPlayingData>(
				GET_QUEUE_NOW_PLAYING,
				{ fetchPolicy: "cache-first" },
			)

		const [ playSong, result ] =
			useMutation<PlaySongData, SongIDBase>(PLAY_SONG, {
				variables,
				optimisticResponse: {
					playSong: {
						nowPlaying: song,
					},
				},
				update: update(isOptimistic),
			})

		const isPlaying = (
			!isUndefined(data) &&
			!isNull(data.getQueue.nowPlaying) &&
			data.getQueue.nowPlaying.songID === songID
		)

		const handlePlaySong =
			async () => {
				if (!result.loading) {
					if (isPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						await playSong()
						dispatch(updatePlay(true))
					}
				}
			}

		return [ handlePlaySong, isPlaying, result ] as UsePlaySongResult
	}