import Howler from "react-howler"
import { createElement, VFC } from "react"
import { SongID } from "@oly_op/music-app-common/types"

import { useResetPlayer } from "../../hooks"
import { createCatalogMP3URL } from "../../helpers"
import { useStatePlay, useStateVolume } from "../../redux"

const BarHowler: VFC<SongID> =
	({ songID }) => {
		const play = useStatePlay()
		const volume = useStateVolume()
		const resetPlayer = useResetPlayer()
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

export default BarHowler