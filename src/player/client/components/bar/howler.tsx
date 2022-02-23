import Howler from "react-howler"
import { createElement, useState, useEffect, VFC } from "react"

import { Song } from "../../types"
import { useResetPlayer } from "../../hooks"
import setMediaSession from "./set-media-session"
import { createCatalogMP3URL } from "../../helpers"
import { useStatePlay, useStateVolume } from "../../redux"

const isAudioBlocked =
	async () => {
		try {
			const context = new AudioContext()
			await context.close()
			return true
		} catch (error) {
			return false
		}
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
			const checkFunction =
				async () => setCanPlay(!(await isAudioBlocked()))
			checkFunction().catch(console.error)
		}, [])

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

		return canPlay ? (
			<Howler
				playing={play}
				onEnd={resetPlayer}
				volume={volume / 100}
				xhr={{ mode: "cors" }}
				src={createCatalogMP3URL(songID)}
			/>
		) : null
	}

interface PropTypes {
	song: Song,
}

export default BarHowler