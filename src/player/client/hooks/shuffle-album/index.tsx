import { MutationResult } from "@apollo/client"
import { AlbumIDBase } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { getUserID } from "../../helpers"
import SHUFFLE_ALBUM from "./shuffle-album.gql"
import { useResetPlayer } from "../reset-player"
import { useDispatch, updatePlay } from "../../redux"
import { Handler, UserQueuesNowPlayingExtracted } from "../../types"

export const useShuffleAlbum =
	(albumID: string) => {
		const userID = getUserID()
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()
		const variables: AlbumIDBase = { albumID }

		const [ shuffleAlbum, result ] =
			useMutation<Data, AlbumIDBase>(SHUFFLE_ALBUM, {
				variables,
				optimisticResponse: {
					shuffleAlbum: {
						userID,
						queueNext: [],
						queueLater: [],
						nowPlaying: null,
						queuePrevious: [],
						__typename: "User",
					},
				},
			})

		const handleShuffleAlbum =
			async () => {
				if (!result.loading) {
					resetPlayer()
					await shuffleAlbum()
					dispatch(updatePlay(true))
				}
			}

		return [
			handleShuffleAlbum,
			result,
		] as [
			shuffleAlbum: Handler,
			result: MutationResult<Data>,
		]
	}

interface Data {
	shuffleAlbum: UserQueuesNowPlayingExtracted,
}