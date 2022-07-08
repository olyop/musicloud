import { createElement, FC } from "react"
import { SongID } from "@oly_op/musicloud-common"

import { User } from "../../../types"
import { useMutation } from "../../../hooks"
import QUEUE_SONG_AFTER from "./queue-song-after.gql"
import { ModalButton, ModalOnClose } from "../../modal"

const AfterButton: FC<PropTypes> = ({ songID, onClose }) => {
	const [ after, { loading } ] =
		useMutation<Data, SongID>(
			QUEUE_SONG_AFTER,
			{ variables: { songID } },
		)

	const handleClick =
		() => {
			if (!loading) {
				void after()
			}
		}

	return (
		<ModalButton
			text="After"
			icon="queue"
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

export default AfterButton