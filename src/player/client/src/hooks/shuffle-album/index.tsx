import { AlbumID } from "@oly_op/musicloud-common/build/types"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import { useResetPlayer } from "../reset-player"
import { updateNowPlayingMutationFunction } from "../../helpers"

import SHUFFLE_ALBUM from "./shuffle-album.gql"

export const useShuffleAlbum =
	({ albumID }: AlbumID) => {
		const resetPlayer = useResetPlayer()

		const [ shuffleAlbum, result ] =
			useMutation<Data, AlbumID>(SHUFFLE_ALBUM, {
				variables: { albumID },
				update: updateNowPlayingMutationFunction(({ shuffleAlbum: { nowPlaying } }) => nowPlaying),
			})

		const handler =
			() => {
				if (!result.loading) {
					resetPlayer()
					void shuffleAlbum()
				}
			}

		return [ handler, result ] as const
	}

interface Data {
	shuffleAlbum: QueueNowPlaying,
}