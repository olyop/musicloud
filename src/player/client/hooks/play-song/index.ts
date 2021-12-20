import { useRef } from "react"
import isNull from "lodash/isNull"
import isUndefined from "lodash/isUndefined"
import { SongID } from "@oly_op/music-app-common/types"

import update from "./update"
import { Song } from "../../types"
import { useQuery } from "../query"
import PLAY_SONG from "./play-song.gql"
import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import { togglePlay, useDispatch } from "../../redux"
import { Input, QueryData, Data, Result } from "./types"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"

const isSong =
	(song: Input): song is Song =>
		"__typeName" in song

export const usePlaySong =
	(song: Input) => {
		const { songID } = song
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()
		const variables: SongID = { songID }
		const isOptimistic = useRef(isSong(song))

		const { data } =
			useQuery<QueryData>(
				GET_QUEUE_NOW_PLAYING,
				{ fetchPolicy: "cache-first" },
			)

		const [ playSong, result ] =
			useMutation<Data, SongID>(PLAY_SONG, {
				variables,
				optimisticResponse: isSong(song) ? {
					playSong: {
						nowPlaying: song,
					},
				} : undefined,
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
					}
				}
			}

		return [ handlePlaySong, isPlaying, result ] as Result
	}