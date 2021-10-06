// import isNull from "lodash/isNull"
// import isUndefined from "lodash/isUndefined"
import { MutationResult } from "@apollo/client"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

// import { useQuery } from "../query"
import { User, Handler } from "../../types"
import { useMutation } from "../mutation"
import PLAY_PLAYLIST from "./play-playlist.gql"
import { useResetPlayer } from "../reset-player"
// import GET_USER_NOW_PLAYING from "./get-user-now-playing.gql"
import { useDispatch, updatePlay, useStatePlay, togglePlay } from "../../redux"

export const usePlayPlaylist =
	(playlistID: string) => {
		const play = useStatePlay()
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playPlaylist, result ] =
			useMutation<Data, PlaylistIDBase>(PLAY_PLAYLIST, {
				variables: { playlistID },
			})

		// const { data } =
		// 	useQuery<UserCurrentRes>(GET_USER_NOW_PLAYING, {
		// 		fetchPolicy: "cache-first",
		// 	})

		const isNowPlaying =
			false

		const handlePlayPlaylist =
			async () => {
				if (!result.loading) {
					if (isNowPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						await playPlaylist()
						dispatch(updatePlay(true))
					}
				}
			}

		return [
			handlePlayPlaylist,
			isNowPlaying && play,
			result,
		] as [
			playPlaylist: Handler,
			isPlaying: boolean,
			result: MutationResult<Data>,
		]
	}

interface Data {
	shuffleAlbum: User,
}

// interface UserCurrentRes {
// 	user: User,
// }