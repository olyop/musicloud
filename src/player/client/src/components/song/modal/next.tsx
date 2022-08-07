import { createElement, FC } from "react"
import { SongID } from "@oly_op/musicloud-common/build/types"

import { useMutation } from "../../../hooks"
import { ModalButton, ModalOnClose } from "../../modal"

import QUEUE_SONG_NEXT from "./queue-song-next.gql"

const NextButton: FC<PropTypes> = ({ songID, onClose }) => {
	const [ next, { loading } ] =
		useMutation<unknown, SongID>(
			QUEUE_SONG_NEXT,
			{ variables: { songID } },
		)

	const handleClick =
		() => {
			if (!loading) {
				void next()
			}
		}

	return (
		<ModalButton
			text="Next"
			onClose={onClose}
			icon="playlist_add"
			onClick={handleClick}
		/>
	)
}

interface PropTypes
	extends SongID, ModalOnClose {
	hidePlay?: boolean,
}

export default NextButton