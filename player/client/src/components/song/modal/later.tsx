import { createElement, FC } from "react"
import { SongID } from "@oly_op/musicloud-common"

import { User } from "../../../types"
import { useMutation } from "../../../hooks"
import QUEUE_SONG_LATER from "./queue-song-later.gql"
import { ModalButton, ModalOnClose } from "../../modal"

const LaterButton: FC<PropTypes> = ({ songID, onClose }) => {
	const [ later, { loading } ] =
		useMutation<Data, SongID>(
			QUEUE_SONG_LATER,
			{ variables: { songID } },
		)

	const handleClick =
		() => {
			if (!loading) {
				void later()
			}
		}

	return (
		<ModalButton
			icon="queue"
			text="Later"
			onClose={onClose}
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

export default LaterButton