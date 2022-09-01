import { createElement, FC } from "react"
import Button from "@oly_op/react-button"

import { QueueNowPlaying } from "../../types"
import { updatePlay, useDispatch } from "../../redux"
import { useMutation, useResetPlayer } from "../../hooks"
import { updateNowPlayingMutationFunction } from "../../helpers"

import SHUFFLE_LIBRARY from "./shuffle-library.gql"

const ShuffleButton: FC<PropTypes> = ({ hideButtonText }) => {
	const dispatch = useDispatch()
	const resetPlayer = useResetPlayer()

	const [ libraryShuffle ] =
		useMutation<Data>(SHUFFLE_LIBRARY, {
			update: updateNowPlayingMutationFunction(({ shuffleLibrary }) => shuffleLibrary.nowPlaying),
		})

	const handleLibraryShuffle =
		() => {
			resetPlayer()
			void libraryShuffle().finally(() => (
				dispatch(updatePlay(true))
			))
		}

	return (
		<Button
			icon="shuffle"
			title="Shuffle"
			onClick={handleLibraryShuffle}
			text={hideButtonText ? undefined : "Shuffle"}
		/>
	)
}

interface Data {
	shuffleLibrary: QueueNowPlaying,
}

interface PropTypes {
	hideButtonText: boolean,
}

export default ShuffleButton