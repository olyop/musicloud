import Howler from "react-howler"
import { createElement, useEffect, VFC } from "react"

import { Song } from "../../types"
import { useResetPlayer } from "../../hooks"
import setMediaSession from "./set-media-session"
import { createCatalogMP3URL } from "../../helpers"
import { useStatePlay, useStateVolume } from "../../redux"

const BarHowler: VFC<PropTypes> =
	({ song }) => {
		const { songID } = song
		const play = useStatePlay()
		const volume = useStateVolume()
		const resetPlayer = useResetPlayer()

		useEffect(() => {
			if ("mediaSession" in navigator) {
				setMediaSession(song)
			}
		}, [songID])

		useEffect(() => {
			if ("mediaSession" in navigator) {
				if (play) {
					navigator.mediaSession.playbackState = "playing"
				} else {
					navigator.mediaSession.playbackState = "paused"
				}
			}
		}, [play])

		return (
			<Howler
				playing={play}
				onEnd={resetPlayer}
				volume={volume / 100}
				xhr={{ mode: "cors" }}
				src={createCatalogMP3URL(songID)}
			/>
		)
	}

interface PropTypes {
	song: Song,
}

export default BarHowler