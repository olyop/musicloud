import { MutationResult } from "@apollo/client"
import { AlbumIDBase } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import SHUFFLE_ALBUM from "./shuffle-album.gql"
import { useResetPlayer } from "../reset-player"
import { useDispatch, updatePlay } from "../../redux"
import { Handler, QueueNowPlaying } from "../../types"

export const useShuffleAlbum =
	({ albumID }: AlbumIDBase) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()
		const variables: AlbumIDBase = { albumID }

		const [ shuffleAlbum, result ] =
			useMutation<ShuffleAlbumData, AlbumIDBase>(SHUFFLE_ALBUM, { variables })

		const handleShuffleAlbum =
			async () => {
				if (!result.loading) {
					resetPlayer()
					await shuffleAlbum()
					dispatch(updatePlay(true))
				}
			}

		return [ handleShuffleAlbum, result ] as UseShuffleAlbumResult
	}

type UseShuffleAlbumResult = [
	shuffleAlbum: Handler,
	result: MutationResult<ShuffleAlbumData>,
]

interface ShuffleAlbumData {
	shuffleAlbum: QueueNowPlaying,
}