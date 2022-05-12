/* eslint-disable react-hooks/rules-of-hooks */

import { useRef } from "react"
import { MutationResult, useApolloClient } from "@apollo/client"
import { isNull, isUndefined } from "lodash-es"
import { SongID } from "@oly_op/musicloud-common"

import { Song } from "../../types"
import { useQuery } from "../query"
import PLAY_SONG from "./play-song.gql"
import { useMutation } from "../mutation"
import { mutationUpdater, updateNowPlayingCache } from "./update"
import { useResetPlayer } from "../reset-player"
import { Input, QueryData, Data } from "./types"
import { togglePlay, useDispatch } from "../../redux"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"

const isSong =
	(song: Input): song is Song =>
		"__typename" in song

export const usePlaySong =
	(song?: Input) => {
		if (isUndefined(song)) {
			return [
				() => {},
				false,
				{} as MutationResult<Data>,
			] as const
		}

		const { songID } = song
		const dispatch = useDispatch()
		const client = useApolloClient()
		const isOptimistic = useRef(false)
		const resetPlayer = useResetPlayer()
		const variables: SongID = { songID }

		const { data } =
			useQuery<QueryData>(
				GET_QUEUE_NOW_PLAYING,
				{ fetchPolicy: "cache-first" },
			)

		const toggleIsOptimistic =
			(value: boolean) => {
				isOptimistic.current = value
			}

		const [ playSong, result ] =
			useMutation<Data, SongID>(PLAY_SONG, {
				variables,
				optimisticResponse: isSong(song) ? ({
					playSong: {
						nowPlaying: song,
					},
				}) : undefined,
				update: mutationUpdater({
					toggleIsOptimistic,
					isOptimistic: isOptimistic.current,
				}),
			})

		const isPlaying = (
			!isUndefined(data) &&
			!isNull(data.getQueue.nowPlaying) &&
			data.getQueue.nowPlaying.songID === songID
		)

		const handlePlaySong =
			() => {
				if (!result.loading) {
					if (isPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						void playSong().catch(() => {
							updateNowPlayingCache(client.cache)({ songID })
						})
					}
				}
			}

		return [
			handlePlaySong,
			isPlaying,
			result,
		] as const
	}