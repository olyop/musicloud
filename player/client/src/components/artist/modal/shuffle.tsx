import { createElement, FC } from "react"
import { ArtistID } from "@oly_op/musicloud-common"

import { Handler } from "../../../types"
import { ModalButton } from "../../modal"
import { useShuffleArtist } from "../../../hooks"

const ShuffleButton: FC<PropTypes> = ({ onClose, artistID }) => {
	const [ shuffle ] = useShuffleArtist({ artistID })
	return (
		<ModalButton
			icon="shuffle"
			text="Shuffle"
			onClose={onClose}
			onClick={shuffle}
		/>
	)
}

interface PropTypes extends ArtistID {
	onClose: Handler,
}

export default ShuffleButton