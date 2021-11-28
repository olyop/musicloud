import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import { AlbumIDBase } from "@oly_op/music-app-common/types"

import { usePlayAlbum } from "../../hooks"
import { useStatePlay } from "../../redux"

const AlbumPlayButton: VFC<AlbumIDBase> = ({ albumID }) => {
	const play = useStatePlay()
	const [ playAlbum, isPlaying ] = usePlayAlbum({ albumID })
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

export default AlbumPlayButton