import Howler from "react-howler"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import { useLocation, NavLink } from "react-router-dom"
import { useFullScreenHandle, FullScreen } from "react-full-screen"

import Song from "../song"
import BarVolume from "./volume"
import Progress from "../progress"
import { User } from "../../types"
import BarControls from "./controls"
import BarFullscreen from "./fullscreen"
import { determineCatalogMP3URL } from "../../helpers"
import GET_USER_CURRENT from "./get-user-now-playing.gql"
import NEXT_QUEUE_SONG from "./controls/next-queue-song.gql"
import { useMutation, useQuery, useResetPlayer } from "../../hooks"
import { useStatePlay, updatePlay, useDispatch, useStateVolume } from "../../redux"

import "./index.scss"
import Window from "../window"

const bem =
	createBEM("Bar")

const Bar: FC = () => {
	const play = useStatePlay()
	const dispatch = useDispatch()
	const volume = useStateVolume()
	const { pathname } = useLocation()
	const resetPlayer = useResetPlayer()
	const fullscreen = useFullScreenHandle()

	const { data } =
		useQuery<Data>(GET_USER_CURRENT)

	const [ nextQueueSong ] =
		useMutation(NEXT_QUEUE_SONG)

	const handleEnd =
		async () => {
			resetPlayer()
			await nextQueueSong()
			dispatch(updatePlay(true))
		}

	return (
		<footer className={bem("", "Elevated")}>
			<Window>
				{({ width }) => (
					<BarControls
						className={bem("controls")}
						hidePreviousNext={width <= 700}
						playButtonClassName={bem("controls-play")}
						playButtonIconClassName={bem("controls-play-icon")}
					/>
				)}
			</Window>
			{data?.user.nowPlaying && (
				<div className={bem("main", "PaddingHalf")}>
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
						<div className={bem("main-content-actions", "FlexListRight")}>
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
					<Progress
						duration={data.user.nowPlaying.duration}
					/>
				</div>
			)}
		</footer>
	)
}

interface Data {
	user: User,
}

export default Bar