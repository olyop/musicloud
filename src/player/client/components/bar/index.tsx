import Howler from "react-howler"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useLocation, NavLink } from "react-router-dom"
import { SongID } from "@oly_op/music-app-common/types"
import { useEffect, useState, createElement, VFC, Fragment } from "react"

import Song from "../song"
import Modal from "../modal"
import BarVolume from "./volume"
import Progress from "../progress"
import BarControls from "./controls"
import setMetadata from "./set-metadata"
import BarFullscreen from "./fullscreen"
import { QueueNowPlaying } from "../../types"
import { determineCatalogMP3URL } from "../../helpers"
import { useQuery, useResetPlayer } from "../../hooks"
import { useStatePlay, useStateVolume } from "../../redux"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"

import "./index.scss"

const bem =
	createBEM("Bar")

const BarQueueButton: VFC =
	() => {
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
				src={determineCatalogMP3URL(songID)}
			/>
		)
	}

const Bar: VFC = () => {
	const [ expand, setExpand ] =
		useState(false)

	const { data, loading } =
		useQuery<GetQueueNowPlayingData>(GET_QUEUE_NOW_PLAYING)

	const handleExpandOpen =
		() => setExpand(true)

	const handleExpandClose =
		() => setExpand(false)

	useEffect(() => {
		if (data?.getQueue.nowPlaying) {
			setMetadata(data.getQueue.nowPlaying)
		}
	}, [data])

	if (loading) {
		return (
			<footer className={bem("", "Elevated")}/>
		)
	} else {
		return (
			<Fragment>
				<footer className={bem("", "Elevated")}>
					<BarControls
						className={bem("controls")}
						buttonClassName={bem("controls-button")}
						buttonIconClassName={bem("controls-button-icon")}
					/>
					<div className={bem("main", "PaddingHalf")}>
						<div className={bem("main-content-wrapper")}>
							<div className={bem("main-content")}>
								{data?.getQueue.nowPlaying ? (
									<Song
										hidePlay
										hidePlays
										hideDuration
										song={data.getQueue.nowPlaying}
									/>
								) : (
									<div/>
								)}
								<div className="FlexRowRight">
									<BarQueueButton/>
									<BarVolume/>
								</div>
							</div>
						</div>
						<Progress
							duration={data?.getQueue.nowPlaying?.duration || 0}
						/>
					</div>
					<Button
						transparent
						title="Player"
						icon="unfold_more"
						onClick={handleExpandOpen}
						className={bem("expand-button")}
					/>
				</footer>
				{data?.getQueue.nowPlaying && (
					<Fragment>
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
							{data?.getQueue.nowPlaying && (
								<BarFullscreen
									onExit={handleExpandClose}
									song={data?.getQueue.nowPlaying}
								/>
							)}
						</Modal>
						<BarHowler
							songID={data.getQueue.nowPlaying.songID}
						/>
					</Fragment>
				)}
			</Fragment>
		)
	}
}

interface GetQueueNowPlayingData {
	getQueue: QueueNowPlaying,
}

export default Bar