import isNull from "lodash-es/isNull"
import uniqueID from "lodash-es/uniqueId"
import { useEffect, useRef } from "react"
import { useAudioPlayer as useAudio } from "react-use-audio-player"

import { Song } from "../../types"
import { useNextQueueSong } from "../../hooks"
import { createCatalogMP3URL } from "../../helpers"
import { addError, updatePlay, useDispatch, useStatePlay, useStateVolume } from "../../redux"

const XHR_OPTIONS: NonNullable<Parameters<typeof useAudio>[0]>["xhr"] = {
	headers: {
		// For Workbox, even though CORS is allowed for the MP3 URL.
		"Access-Control-Allow-Origin": "*",
	},
}

const useSongAudio =
	(song: Song | null) => {
		const play = useStatePlay()
		const dispatch = useDispatch()
		const volume = useStateVolume()
		const hasHitPlay = useRef(false)
		const isSongNotNull = !isNull(song)

		const audio =
			useAudio()

		const [ nextQueueSong ] =
			useNextQueueSong()

		useEffect(() => {
			if (isSongNotNull) {
				if (hasHitPlay.current) {
					audio.load({
						xhr: XHR_OPTIONS,
						volume: volume / 100,
						src: createCatalogMP3URL(song.songID),
					})
				}
			} else {
				hasHitPlay.current = true
			}
		}, [song, hasHitPlay.current])

		useEffect(() => {
			if (play && !hasHitPlay.current) {
				hasHitPlay.current = true
			}
		}, [play])

		useEffect(() => {
			if (isSongNotNull) {
				if (audio.ready) {
					if (play) {
						audio.play()
					} else {
						audio.pause()
					}
				}
			}
		}, [play])

		useEffect(() => {
			if (isSongNotNull) {
				audio.volume(volume / 100)
			}
		}, [volume])

		useEffect(() => {
			if (isSongNotNull) {
				if (audio.ready && audio.ended) {
					void nextQueueSong()
				}
			}
		}, [audio.ended])

		useEffect(() => {
			if (isSongNotNull) {
				if (audio.ready) {
					if (hasHitPlay.current) {
						dispatch(updatePlay(true))
					} else {
						hasHitPlay.current = true
					}
				}
			}
		}, [audio.ready])

		useEffect(() => {
			if (isSongNotNull) {
				if (audio.error) {
					dispatch(addError({
						errorID: uniqueID(),
						location: "useSongAudio",
						message: audio.error.message,
					}))
				}
			}
		}, [audio.error])

		return [ audio, hasHitPlay.current ] as const
	}

export default useSongAudio