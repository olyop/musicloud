import { createElement, FC } from "react"
import { AlbumID } from "@oly_op/musicloud-common/build/types"

import { useShuffleAlbum } from "../../../hooks"
import { ModalButton, ModalOnClose } from "../../modal"

const ShuffleButton: FC<PropTypes> = ({ onClose, albumID }) => {
	const [ shuffleAlbum ] = useShuffleAlbum({ albumID })
	return (
		<ModalButton
			icon="shuffle"
			text="Shuffle"
			onClose={onClose}
			onClick={shuffleAlbum}
		/>
	)
}

interface PropTypes
	extends AlbumID, ModalOnClose {}

export default ShuffleButton