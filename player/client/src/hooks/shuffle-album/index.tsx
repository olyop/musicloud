import { useEffect } from "react"
import { AlbumID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import SHUFFLE_ALBUM from "./shuffle-album.gql"
import { useResetPlayer } from "../reset-player"
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
			() => {
				if (!result.loading) {
					resetPlayer()
					void shuffleAlbum()
				}
			}

		useEffect(() => {
			if (result.data) {
				dispatch(updatePlay(true))
			}
		}, [result.data])

		return [ handleShuffleAlbum, result ] as const
	}

interface Data {
	shuffleAlbum: QueueNowPlaying,
}