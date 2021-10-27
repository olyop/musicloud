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
import GET_USER_QUEUES from "./get-user-queues.gql"
import { determineCatalogMP3URL } from "../../helpers"
import { useQuery, useResetPlayer } from "../../hooks"
import { useStatePlay, useStateVolume } from "../../redux"

import "./index.scss"

const BarQueueButton: FC = () => {
	const { pathname } = useLocation()
	return (
		<NavLink to="/queues">
			<Button
				title="Queue"
				icon="queue_music"
				transparent={pathname !== "/queues"}
			/>
		</NavLink>
	)
}

const bem =
	createBEM("Bar")

const Bar: FC = () => {
	const play = useStatePlay()
	const volume = useStateVolume()
	const resetPlayer = useResetPlayer()

	const [ expand, setExpand ] =
		useState(false)

	const { data } =
		useQuery<Data>(GET_USER_QUEUES)

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
			{data?.user.nowPlaying ? (
				<Fragment>
					<Howler
						playing={play}
						onEnd={resetPlayer}
						volume={volume / 100}
						onLoadError={resetPlayer}
						src={determineCatalogMP3URL(data.user.nowPlaying.songID)}
					/>
					<BarControls
						className={bem("controls")}
						buttonClassName={bem("controls-button")}
						buttonIconClassName={bem("controls-button-icon")}
					/>
					<div className={bem("main", "PaddingHalf")}>
						<div className={bem("main-content-wrapper")}>
							<div className={bem("main-content")}>
								<Song
									hidePlay
									hidePlays
									hideDuration
									song={data.user.nowPlaying}
								/>
								<div className="FlexListRight">
									<BarVolume/>
									<BarQueueButton/>
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
					</div>
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
				</Fragment>
			) : (
				<p className="BodyOne">
					Queue empty.
				</p>
			)}
		</footer>
	)
}

interface Data {
	user: User,
}

export default Bar