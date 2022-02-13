import noop from "lodash-es/noop"
import Howler from "react-howler"
import { createElement, useEffect, VFC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import { Song } from "../../types"
import { useResetPlayer } from "../../hooks"
import { useStatePlay, useStateVolume } from "../../redux"
import { createCatalogImageURL, createCatalogMP3URL } from "../../helpers"

const BarHowler: VFC<PropTypes> =
	({ song }) => {
		const { songID } = song
		const play = useStatePlay()
		const volume = useStateVolume()
		const resetPlayer = useResetPlayer()

		useEffect(() => {
			navigator.mediaSession.metadata =
				new MediaMetadata({
					title: song.title,
					album: song.album.title,
					artist: song.artists.toString(),
					artwork: [{
						type: "image/jpeg",
						src: createCatalogImageURL(
							song.album.albumID,
							"cover",
							ImageSizes.HALF,
							ImageDimensions.SQUARE,
						)
					}]
				})

			navigator.mediaSession.setActionHandler("play", noop)
			navigator.mediaSession.setActionHandler("pause", noop)
			navigator.mediaSession.setActionHandler("nexttrack", noop)
			navigator.mediaSession.setActionHandler("previoustrack", noop)
		}, [songID])

		useEffect(() => {
			navigator.mediaSession.playbackState = "playing"
		}, [])

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