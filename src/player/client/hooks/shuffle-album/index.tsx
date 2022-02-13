import { MutationResult } from "@apollo/client"
import { AlbumID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import SHUFFLE_ALBUM from "./shuffle-album.gql"
import { useResetPlayer } from "../reset-player"
import { HandlerPromise, QueueNowPlaying } from "../../types"
import { updatePlay, useDispatch } from "../../redux"

export const useShuffleAlbum =
	({ albumID }: AlbumID) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ shuffleAlbum, result ] =
			useMutation<Data, AlbumID>(SHUFFLE_ALBUM, {
				variables: { albumID },
			})

		const handleShuffleAlbum =
			async () => {
				if (!result.loading) {
					resetPlayer()
					await shuffleAlbum()
					dispatch(updatePlay(true))
				}
			}

		return [ handleShuffleAlbum, result ] as Result
	}

interface Data {
	shuffleAlbum: QueueNowPlaying,
}

type Result = [
	shuffleAlbum: HandlerPromise,
	result: MutationResult<Data>,
]