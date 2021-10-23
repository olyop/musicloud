import Howler from "react-howler"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useLocation, NavLink } from "react-router-dom"
import { createElement, FC, Fragment, useEffect, useState } from "react"

import Song from "../song"
import Modal from "../modal"
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

	const [ expand, setExpand ] =
		useState(false)

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

	const handleExpandOpen =
		() => setExpand(true)

	const handleExpandClose =
		() => setExpand(false)

	useEffect(() => {
		if (data?.user.nowPlaying) {
			setMetadata(data.user.nowPlaying)
		}
	}, [data])

	return (
		<footer className={bem("", "Elevated")}>
			<BarControls
				className={bem("controls")}
				buttonClassName={bem("controls-button")}
				buttonIconClassName={bem("controls-button-icon")}
			/>
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
								<Song
									hidePlay
									hidePlays
									hideDuration
									song={data.user.nowPlaying}
								/>
								<div className="FlexListRight">
									<BarVolume/>
									<NavLink to="/queues">
										<Button
											title="Queue"
											icon="queue_music"
											transparent={pathname !== "/queues"}
										/>
									</NavLink>
									<Button
										transparent
										title="Player"
										icon="unfold_more"
										onClick={handleExpandOpen}
									/>
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
			{data?.user.nowPlaying && (
				<Modal
					open={expand}
					onClose={handleExpandClose}
					contentClassName={bem("expand")}
				>
					<Button
						transparent
						icon="close"
						title="Close Player"
						onClick={handleExpandClose}
						className={bem("expand-close")}
					/>
					<BarFullscreen
						onExit={handleExpandClose}
						nowPlaying={data.user.nowPlaying}
					/>
				</Modal>
			)}
		</footer>
	)
}

interface Data {
	user: User,
}

export default Bar