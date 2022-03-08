import { AlbumID } from "@oly_op/musicloud-common"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import SHUFFLE_ALBUM from "./shuffle-album.gql"
import { useResetPlayer } from "../reset-player"

export const useShuffleAlbum =
	({ albumID }: AlbumID) => {
		const resetPlayer = useResetPlayer()

		const [ shuffleAlbum, result ] =
			useMutation<Data, AlbumID>(SHUFFLE_ALBUM, {
				variables: { albumID },
			})

		const handleShuffleAlbum =
			() => {
				if (!result.loading) {
					resetPlayer()
					void shuffleAlbum()
				}
			}

		return [ handleShuffleAlbum, result ] as const
	}

interface Data {
	shuffleAlbum: QueueNowPlaying,
}