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
			if ("navigator" in navigator) {
				navigator.mediaSession.metadata =
					new MediaMetadata({
						title: song.title,
						album: song.album.title,
						artist: song.artists.toString(),
						artwork: [{
							src: createCatalogImageURL(
								song.album.albumID,
								"cover",
								ImageSizes.HALF,
								ImageDimensions.SQUARE,
							)
						}]
					})
			}
		}, [songID])

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