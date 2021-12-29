import { MutationResult } from "@apollo/client"
import { AlbumID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import SHUFFLE_ALBUM from "./shuffle-album.gql"
import { useResetPlayer } from "../reset-player"
import { HandlerPromise, QueueNowPlaying } from "../../types"

export const useShuffleAlbum =
	({ albumID }: AlbumID) => {
		const resetPlayer = useResetPlayer()
		const variables: AlbumID = { albumID }

		const [ shuffleAlbum, result ] =
			useMutation<Data, AlbumID>(SHUFFLE_ALBUM, { variables })

		const handleShuffleAlbum =
			async () => {
				if (!result.loading) {
					resetPlayer()
					await shuffleAlbum()
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