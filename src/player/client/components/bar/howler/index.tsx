import Howler from "react-howler"
import { createElement, useEffect, VFC, Fragment } from "react"

import { Song } from "../../../types"
import { useResetPlayer } from "../../../hooks"
import setMediaSession from "./set-media-session"
import { createCatalogMP3URL } from "../../../helpers"
import { useStatePlay, useStateVolume } from "../../../redux"

const BarHowler: VFC<PropTypes> =
	({ song }) => {
		const { songID } = song
		const play = useStatePlay()
		const volume = useStateVolume()
		const resetPlayer = useResetPlayer()

		useEffect(() => {
			setMediaSession(song)
		}, [songID])

		useEffect(() => {
			if (play) {
				navigator.mediaSession.playbackState = "playing"
			} else {
				navigator.mediaSession.playbackState = "paused"
			}
		}, [play])

		return play ? (
			<Fragment>
				<Howler
					playing={play}
					onEnd={resetPlayer}
					volume={volume / 100}
					src={createCatalogMP3URL(songID)}
				/>
				<audio
					muted
					autoPlay
					crossOrigin="anonymous"
					style={{ display: "none" }}
					src={createCatalogMP3URL(songID)}
				/>
			</Fragment>
		) : null
	}

interface PropTypes {
	song: Song,
}

export default BarHowler