import { createElement, FC } from "react"
import { SongID } from "@oly_op/musicloud-common"

import { User } from "../../../types"
import { useMutation } from "../../../hooks"
import QUEUE_SONG_NEXT from "./queue-song-next.gql"
import { ModalButton, ModalOnClose } from "../../modal"

const NextButton: FC<PropTypes> = ({ songID, onClose }) => {
	const [ next, { loading } ] =
		useMutation<Data, SongID>(
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

interface Data {
	user: User,
}

interface PropTypes
	extends SongID, ModalOnClose {
	hidePlay?: boolean,
}

export default NextButton