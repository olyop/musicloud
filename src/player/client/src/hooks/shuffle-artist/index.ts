import { ArtistID } from "@oly_op/musicloud-common"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_ARTIST from "./shuffle-artist.gql"

export const useShuffleArtist =
	({ artistID }: ArtistID) => {
		const resetPlayer = useResetPlayer()

		const [ shuffleArtist, result ] =
			useMutation<Data, ArtistID>(
				SHUFFLE_ARTIST,
				{ variables: { artistID } },
			)

		const handleShuffleArtist =
			() => {
				resetPlayer()
				void shuffleArtist()
			}

		return [ handleShuffleArtist, result ] as const
	}

interface Data {
	shuffleArtist: QueueNowPlaying,
}