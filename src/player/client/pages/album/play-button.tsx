import Button from "@oly_op/react-button"
import { createElement, FC } from "react"

import { usePlayAlbum } from "../../hooks"
import { useStatePlay } from "../../redux"

const AlbumPlayButton: FC<PropTypes> = ({ albumID }) => {
	const play = useStatePlay()
	const [ playAlbum, isPlaying ] = usePlayAlbum(albumID)
	const playing = isPlaying && play
	return (
		<Button
			transparent
			className="Border"
			onClick={playAlbum}
			text={playing ? "Pause" : "Play"}
			icon={playing ? "pause" : "play_arrow"}
		/>
	)
}

interface PropTypes {
	albumID: string,
}

export default AlbumPlayButton