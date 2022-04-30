import { createElement, FC } from "react"
import { PlaylistID } from "@oly_op/musicloud-common"

import { useShufflePlaylist } from "../../../hooks"
import { ModalButton, ModalOnClose } from "../../modal"

const ShuffleButton: FC<PropTypes> = ({ onClose, playlistID }) => {
	const [ shuffle ] = useShufflePlaylist({ playlistID })
	return (
		<ModalButton
			icon="shuffle"
			text="Shuffle"
			onClose={onClose}
			onClick={shuffle}
		/>
	)
}

interface PropTypes
	extends ModalOnClose, PlaylistID {}

export default ShuffleButton