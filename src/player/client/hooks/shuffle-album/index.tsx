import { MutationResult } from "@apollo/client"
import { AlbumID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import SHUFFLE_ALBUM from "./shuffle-album.gql"
import { useResetPlayer } from "../reset-player"
import { Handler, QueueNowPlaying } from "../../types"

export const useShuffleAlbum =
	({ albumID }: AlbumID) => {
		const resetPlayer = useResetPlayer()
		const variables: AlbumID = { albumID }

		const [ shuffleAlbum, result ] =
			useMutation<ShuffleAlbumData, AlbumID>(SHUFFLE_ALBUM, { variables })

		const handleShuffleAlbum =
			async () => {
				if (!result.loading) {
					resetPlayer()
					await shuffleAlbum()
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