import isNull from "lodash-es/isNull"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import isUndefined from "lodash-es/isUndefined"
import { useState, createElement, FC, Fragment } from "react"

import Volume from "./volume"
import Progress from "./progress"
import Controls from "./controls"
import Fullscreen from "./fullscreen"
import { useQuery } from "../../hooks"
import Song from "../../components/song"
import useSongAudio from "./use-song-audio"
import { QueueNowPlaying } from "../../types"
import GET_NOW_PLAYING from "./get-now-playing.gql"

import "./index.scss"

const bem =
	createBEM("Bar")

const Bar: FC = () => {
	const [ expand, setExpand ] =
		useState(false)

	const { data } =
		useQuery<Data>(GET_NOW_PLAYING)

	const isNowPlaying =
		!isUndefined(data) &&
		!isNull(data.getQueue.nowPlaying)

	const [ songAudio, hasHitPlay ] =
		useSongAudio(isNowPlaying ? data.getQueue.nowPlaying : null)

	const handleExpandOpen =
		() => setExpand(true)

	const handleExpandClose =
		() => setExpand(false)

	return (
		<footer className={bem("", "BorderTop")}>
			<Fragment>
				<Controls
					error={songAudio.error}
					ready={songAudio.ready}
					hasHitPlay={hasHitPlay}
					isNowPlaying={isNowPlaying}
					className={bem("controls")}
					buttonClassName={bem("controls-button")}
					buttonIconClassName={bem("controls-button-icon")}
				/>
				<div className={bem("main", "PaddingHalf")}>
					<div className={bem("main-content-wrapper")}>
						<div className={bem("main-content")}>
							{data ? (
								<Fragment>
									<Song
										hidePlay
										hidePlays
										hideDuration
										hideTrackNumber
										className={null}
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
					error={songAudio.error}
					ready={songAudio.ready}
					hasHitPlay={hasHitPlay}
					isNowPlaying={isNowPlaying}
					onClose={handleExpandClose}
					song={data?.getQueue.nowPlaying}
				/>
			</Fragment>
		</footer>
	)
}

interface Data {
	getQueue: QueueNowPlaying,
}

export default Bar