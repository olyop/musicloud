import { createElement, FC } from "react"

import { Song } from "../../../types"
import { usePlaySong } from "../../../hooks"
import { useStatePlay } from "../../../redux"
import { ModalButton, ModalOnClose } from "../../modal"

const PlayButton: FC<PropTypes> = ({ song, hidePlay, onClose }) => {
	const play = useStatePlay()

	const [ playSong, isPlaying ] =
		usePlaySong(hidePlay ? undefined : song)

	const playing =
		play && isPlaying

	return (
		<ModalButton
			onClose={onClose}
			onClick={playSong}
			text={playing ? "Pause" : "Play"}
			icon={playing ? "pause" : "play_arrow"}
		/>
	)
}

interface PropTypes extends ModalOnClose {
	song: Song,
	hidePlay?: boolean,
}

export default PlayButton