import { useEffect, useRef } from "react"
import isNull from "lodash-es/isNull"
import isUndefined from "lodash-es/isUndefined"
import { SongID } from "@oly_op/musicloud-common/build/types"

import { Song } from "../../types"
import { useQuery } from "../query"
import { updater } from "./updater"
import PLAY_SONG from "./play-song.gql"
import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import { togglePlay, updatePlay, useDispatch } from "../../redux"
import { Input, GetQueueNowPlayingData, PlaySongData, UpdateIsOptimistic } from "./types"

import GET_QUEUE_NOW_PLAYING_SONG_ID from "./get-queue-now-playing-song-id.gql"

const isSong =
	(song: Input): song is Song =>
		(isNull(song) ? false : "__typename" in song)

export const usePlaySong =
	(song: Input) => {
		const dispatch = useDispatch()
		const isOptimistic = useRef(true)
		const resetPlayer = useResetPlayer()

		const { data } =
			useQuery<GetQueueNowPlayingData>(GET_QUEUE_NOW_PLAYING_SONG_ID, {
				fetchPolicy: "cache-first",
			})

		const [ playSong, result ] =
			useMutation<PlaySongData, SongID>(PLAY_SONG, {
				optimisticResponse: isSong(song) ? ({
					playSong: {
						__typename: "Queue",
						nowPlaying: song,
					},
				}) : undefined,
			})

		const isSongNotNull =
			!isNull(song)

		const isPlaying = (
			isSongNotNull &&
			!isUndefined(data) &&
			!isNull(data.getQueue.nowPlaying) &&
			data.getQueue.nowPlaying.songID === song.songID
		)

		const updateIsOptimistic: UpdateIsOptimistic =
			value => {
				isOptimistic.current = value
			}

		const handler =
			() => {
				if (isSongNotNull) {
					if (isPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						void playSong({
							variables: { songID: song.songID },
							update: updater(isOptimistic.current, updateIsOptimistic),
						})
					}
				}
			}

		useEffect(() => {
			if (result.data) {
				dispatch(updatePlay(true))
			}
		}, [result.data])

		return [ handler,	isPlaying, result	] as const
	}