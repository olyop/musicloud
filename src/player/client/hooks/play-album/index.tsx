import isNull from "lodash/isNull"
import isUndefined from "lodash/isUndefined"
import { MutationResult } from "@apollo/client"
import { AlbumIDBase } from "@oly_op/music-app-common/types"

import { useQuery } from "../query"
import PLAY_ALBUM from "./play-album.gql"
import { useMutation } from "../mutation"
import { User, Handler } from "../../types"
import { useResetPlayer } from "../reset-player"
import GET_USER_NOW_PLAYING from "./get-user-now-playing.gql"
import { useDispatch, updatePlay, useStatePlay, togglePlay } from "../../redux"

export const usePlayAlbum =
	(albumID: string) => {
		const play = useStatePlay()
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playAlbum, result ] =
			useMutation<Data, AlbumIDBase>(PLAY_ALBUM, {
				variables: { albumID },
			})

		const { data } =
			useQuery<UserCurrentRes>(GET_USER_NOW_PLAYING, {
				fetchPolicy: "cache-first",
			})

		const isNowPlaying = (
			!isUndefined(data) &&
			!isNull(data.user.nowPlaying) &&
			data.user.nowPlaying.album.albumID === albumID
		)

		const handlePlayAlbum =
			async () => {
				if (!result.loading) {
					if (isNowPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						await playAlbum()
						dispatch(updatePlay(true))
					}
				}
			}

		return [
			handlePlayAlbum,
			isNowPlaying && play,
			result,
		] as [
			playAlbum: Handler,
			isPlaying: boolean,
			result: MutationResult<Data>,
		]
	}

interface Data {
	shuffleAlbum: User,
}

interface UserCurrentRes {
	user: User,
}