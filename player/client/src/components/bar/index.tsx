import isNull from "lodash-es/isNull"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import isUndefined from "lodash-es/isUndefined"
import { useState, createElement, VFC, Fragment } from "react"

import Song from "../song"
import Volume from "./volume"
import Progress from "./progress"
import Controls from "./controls"
import Fullscreen from "./fullscreen"
import { useQuery } from "../../hooks"
import { QueueNowPlaying } from "../../types"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"

import "./index.scss"
import useSongAudio from "./user-song-audio"

const bem =
	createBEM("Bar")

const Bar: VFC = () => {
	const [ expand, setExpand ] =
		useState(false)

	const { data, loading } =
		useQuery<Data>(GET_QUEUE_NOW_PLAYING)

	const songAudio =
		useSongAudio(data?.getQueue.nowPlaying || null)

	const isNowPlaying =
		!isUndefined(data) && !isNull(data.getQueue.nowPlaying)

	const handleExpandOpen =
		() => setExpand(true)

	const handleExpandClose =
		() => setExpand(false)

	return (
		<footer className={bem("", "Elevated")}>
			{loading || (
				<Fragment>
					<Controls
						ready={songAudio.ready}
						className={bem("controls")}
						buttonClassName={bem("controls-button")}
						buttonIconClassName={bem("controls-button-icon")}
					/>
					<div className={bem("main", "PaddingHalf")}>
						<div className={bem("main-content-wrapper")}>
							<div className={bem("main-content")}>
								{data?.getQueue.nowPlaying ? (
									<Fragment>
										<Song
											hidePlay
											hidePlays
											hideDuration
											hideTrackNumber
											song={data.getQueue.nowPlaying}
										/>
										<div className="FlexRowRight">
											<NavLink to="/queues">
												{({ isActive }) => (
													<Button
														title="Queue"
														icon="queue_music"
														transparent={!isActive}
													/>
												)}
											</NavLink>
											<Volume/>
											<Button
												transparent
												title="Player"
												icon="unfold_more"
												onClick={handleExpandOpen}
												className={bem("main-content-expand")}
											/>
										</div>
									</Fragment>
								) : (
									<Fragment>
										<div/>
										<div/>
									</Fragment>
								)}
							</div>
						</div>
						<Progress
							ready={songAudio.ready}
							isNowPlaying={isNowPlaying}
						/>
					</div>
					{data?.getQueue.nowPlaying && (
						<Button
							transparent
							title="Player"
							icon="unfold_more"
							className={bem("expand")}
							onClick={handleExpandOpen}
						/>
					)}
					<Fullscreen
						open={expand}
						ready={songAudio.ready}
						isNowPlaying={isNowPlaying}
						onClose={handleExpandClose}
						song={data?.getQueue.nowPlaying}
					/>
				</Fragment>
			)}
		</footer>
	)
}

interface Data {
	getQueue: QueueNowPlaying,
}

export default Bar