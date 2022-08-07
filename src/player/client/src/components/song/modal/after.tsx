import { createElement, FC } from "react"
import { SongID } from "@oly_op/musicloud-common/build/types"

import { useMutation } from "../../../hooks"
import { ModalButton, ModalOnClose } from "../../modal"

import QUEUE_SONG_AFTER from "./queue-song-after.gql"

const AfterButton: FC<PropTypes> = ({ songID, onClose }) => {
	const [ after, { loading } ] =
		useMutation<unknown, SongID>(
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

interface PropTypes
	extends SongID, ModalOnClose {
	hidePlay?: boolean,
}

export default AfterButton