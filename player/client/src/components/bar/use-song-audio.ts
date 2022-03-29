import { useEffect, useState } from "react"
import { useAudioPlayer as useAudio } from "react-use-audio-player"

import { Song } from "../../types"
import { useNextQueueSong } from "../../hooks"
import { createCatalogMP3URL } from "../../helpers"
import { updatePlay, useDispatch, useStatePlay, useStateVolume } from "../../redux"

const useSongAudio =
	(song: Song | null) => {
		const play = useStatePlay()
		const dispatch = useDispatch()
		const volume = useStateVolume()

		const audio = useAudio()

		const [ hasHitPlay, setHasHitPlay ] =
			useState(false)

		const [ nextQueueSong ] =
			useNextQueueSong()

		useEffect(() => {
			if (song) {
				audio.load({
					volume: volume / 100,
					src: createCatalogMP3URL(song.songID),
				})
			}
		}, [song])

		useEffect(() => {
			if (audio.ready) {
				if (play) {
					audio.play()
				} else {
					audio.pause()
				}
			}
		}, [play])

		useEffect(() => {
			if (audio.ready) {
				audio.volume(volume / 100)
			}
		}, [volume])

		useEffect(() => {
			if (audio.ready && audio.ended) {
				void nextQueueSong()
			}
		}, [audio.ended])

		useEffect(() => {
			if (audio.ready) {
				if (hasHitPlay) {
					dispatch(updatePlay(true))
				} else {
					setHasHitPlay(true)
				}
			}
		}, [audio.ready])

		return audio
	}

export default useSongAudio