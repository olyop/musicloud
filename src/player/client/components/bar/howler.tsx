import Howler from "react-howler"
import { CLOUDFRONT_URL } from "@oly_op/music-app-common/globals"
import { createElement, useState, useEffect, VFC, Fragment } from "react"

import { Song } from "../../types"
import { useResetPlayer } from "../../hooks"
import setMediaSession from "./set-media-session"
import { createCatalogMP3URL } from "../../helpers"
import { useStatePlay, useStateVolume } from "../../redux"

const isAudioBlocked =
	async () => {
		const context = new AudioContext()
		const isBlocked = context.state === "suspended"
		await context.close()
		return isBlocked
	}

const BarHowler: VFC<PropTypes> =
	({ song }) => {
		const { songID } = song
		const play = useStatePlay()
		const volume = useStateVolume()
		const resetPlayer = useResetPlayer()

		const [ canPlay, setCanPlay ] =
			useState(false)

		useEffect(() => {
			const handler =
				async () => {
					const isBlocked = await isAudioBlocked()
					setCanPlay(!isBlocked)
				}
			handler()
				.catch(console.error)
		}, [play, songID])

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

		console.log({
			canPlay,
			play,
		})

		return (
			<Fragment>
				{canPlay && play && (
					<Howler
						preload
						playing={play}
						onEnd={resetPlayer}
						volume={volume / 100}
						src={createCatalogMP3URL(songID)}
					/>
				)}
				<audio
					style={{ display: "none" }}
					src={`${CLOUDFRONT_URL}/sample.mp3`}
				/>
			</Fragment>
		)
	}

interface PropTypes {
	song: Song,
}

export default BarHowler