import { MutationResult } from "@apollo/client"
import { ArtistIDBase } from "@oly_op/music-app-common/types"

import { useUserID } from "../user-id"
import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_ARTIST from "./shuffle-artist.gql"
import { useDispatch, updatePlay } from "../../redux"
import { Handler, UserQueuesNowPlayingExtracted } from "../../types"

export const useShuffleArtist =
	(artistID: string) => {
		const userID = useUserID()
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ shuffleArtist, result ] =
			useMutation<Data, ArtistIDBase>(
				SHUFFLE_ARTIST,
				{
					variables: { artistID },
					optimisticResponse: {
						shuffleArtist: {
							userID,
							queueNext: [],
							queueLater: [],
							nowPlaying: null,
							queuePrevious: [],
							__typename: "User",
						},
					},
				},
			)

		const handleShuffleArtist =
			async () => {
				resetPlayer()
				await shuffleArtist()
				dispatch(updatePlay(true))
			}

		return [
			handleShuffleArtist,
			result,
		] as [
			shuffleArtist: Handler,
			result: MutationResult<Data>,
		]
	}

interface Data {
	shuffleArtist: UserQueuesNowPlayingExtracted,
}