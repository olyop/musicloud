import { SongIDBase } from "@oly_op/music-app-common/types"
import { useApolloClient, MutationResult } from "@apollo/client"

import {
	Song,
	User,
	Handler,
	UserQueuesNowPlayingExtracted,
} from "../../types"

import { useQuery } from "../query"
import PLAY_SONG from "./play-song.gql"
import { getUserID } from "../../helpers"
import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import GET_USER_NOW_PLAYING from "./get-user-now-playing.gql"
import { togglePlay, updatePlay, useDispatch } from "../../redux"

export const usePlaySong =
	(song: Song) => {
		const { songID } = song
		const userID = getUserID()
		const dispatch = useDispatch()
		const { cache } = useApolloClient()
		const resetPlayer = useResetPlayer()

		const variables: SongIDBase =
			{ songID }

		const { data: userData } =
			useQuery<UserNowPlayingData>(
				GET_USER_NOW_PLAYING,
				{ fetchPolicy: "cache-first" },
			)

		const [ mutation, result ] =
			useMutation<PlaySongData, SongIDBase>(PLAY_SONG, { variables })

		const isNowPlaying = (
			userData &&
			userData.user.nowPlaying &&
			userData.user.nowPlaying.songID === songID
		)

		const handler =
			async () => {
				if (!result.loading) {
					if (isNowPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						try {
							await mutation()
						} finally {
							cache.modify({
								id: cache.identify({ userID, __typename: "User" }),
								fields: {
									queueNext: () => [],
									queueLater: () => [],
									nowPlaying: () => song,
									queuePrevious: () => [],
								},
							})
							cache.modify({
								id: cache.identify({ songID, __typename: "Song" }),
								fields: {
									playsTotal: (cached: number) => cached + 1,
								},
							})

							dispatch(updatePlay(true))
						}
					}
				}
			}

		return [
			handler,
			isNowPlaying,
			result,
		] as [
			playSong: Handler,
			isPlaying: boolean,
			result: MutationResult<PlaySongData>,
		]
	}

interface UserNowPlayingData {
	user: User,
}

interface PlaySongData {
	playSong: UserQueuesNowPlayingExtracted,
}