import Howler from "react-howler"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC, Fragment, useEffect } from "react"
import { useLocation, NavLink } from "react-router-dom"
import { useFullScreenHandle, FullScreen } from "react-full-screen"

import Song from "../song"
import Window from "../window"
import BarVolume from "./volume"
import Progress from "../progress"
import { User } from "../../types"
import BarControls from "./controls"
import setMetadata from "./set-metadata"
import BarFullscreen from "./fullscreen"
import { determineCatalogMP3URL } from "../../helpers"
import GET_USER_CURRENT from "./get-user-now-playing.gql"
import NEXT_QUEUE_SONG from "./controls/next-queue-song.gql"
import { useMutation, useQuery, useResetPlayer } from "../../hooks"
import { useStatePlay, updatePlay, useDispatch, useStateVolume } from "../../redux"

import "./index.scss"

const bem =
	createBEM("Bar")

const Bar: FC = () => {
	const play = useStatePlay()
	const dispatch = useDispatch()
	const volume = useStateVolume()
	const { pathname } = useLocation()
	const resetPlayer = useResetPlayer()
	const fullscreen = useFullScreenHandle()

	const { data, loading } =
		useQuery<Data>(GET_USER_CURRENT)

	const [ nextQueueSong ] =
		useMutation(NEXT_QUEUE_SONG)

	const handleEnd =
		async () => {
			resetPlayer()
			await nextQueueSong()
			dispatch(updatePlay(true))
		}

	useEffect(() => {
		if (data?.user.nowPlaying) {
			setMetadata(data.user.nowPlaying)
		}
	}, [data])

	return (
		<footer className={bem("", "Elevated")}>
			<Window>
				{({ width }) => (
					<BarControls
						className={bem("controls")}
						buttonClassName={bem("controls-button")}
						buttonIconClassName={bem("controls-button-icon")}
					/>
				)}
			</Window>
			<div className={bem("main", "PaddingHalf")}>
				{data?.user.nowPlaying && !loading ? (
					<Fragment>
						<div className={bem("main-content-wrapper")}>
							<div className={bem("main-content")}>
								<Howler
									playing={play}
									onEnd={handleEnd}
									volume={volume / 100}
									onLoadError={resetPlayer}
									src={determineCatalogMP3URL(data.user.nowPlaying.songID)}
								/>
								<FullScreen handle={fullscreen}>
									{fullscreen.active && (
										<BarFullscreen
											onExit={fullscreen.exit}
											nowPlaying={data.user.nowPlaying}
										/>
									)}
								</FullScreen>
								<Song
									hidePlay
									hidePlays
									hideDuration
									song={data.user.nowPlaying}
								/>
								<div className="FlexListRight">
									<Button
										transparent
										icon="fullscreen"
										title="Fullscreen"
										onClick={fullscreen.enter}
									/>
									<BarVolume/>
									<NavLink to="/queues">
										<Button
											title="Queue"
											icon="queue_music"
											transparent={pathname !== "/queues"}
										/>
									</NavLink>
								</div>
							</div>
						</div>
						<Progress
							duration={data.user.nowPlaying.duration}
						/>
					</Fragment>
				) : (
					<p className="BodyOne">
						Nothing playing.
					</p>
				)}
			</div>
		</footer>
	)
}

interface Data {
	user: User,
}

export default Bar