import isNull from "lodash-es/isNull"
import { createBEM } from "@oly_op/bem"
import uniqueID from "lodash-es/uniqueId"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { useAudioPlayer as useAudio } from "react-use-audio-player"
import { useState, useEffect, useRef, createElement, FC, Fragment } from "react"

import Volume from "./volume"
import Progress from "./progress"
import Controls from "./controls"
import { NowPlaying } from "./types"
import Fullscreen from "./fullscreen"
import Song from "../../components/song"
import { QueueNowPlaying } from "../../types"
import { createCatalogMP3URL } from "../../helpers"
import { useNextQueueSong, useQuery } from "../../hooks"
import { addError, useDispatch, useStatePlay, useStateVolume } from "../../redux"

import GET_NOW_PLAYING from "./get-now-playing.gql"

import "./index.scss"

const XHR_OPTIONS: NonNullable<Parameters<typeof useAudio>[0]>["xhr"] = {
	headers: {
		// For Workbox, even though CORS is setup.
		"Access-Control-Allow-Origin": "*",
	},
}

/**
 *
 *	WARNING!!
 *	Spaghetti code ahead
 *
 */

const bem =
	createBEM("Bar")

const Bar: FC = () => {
	const play = useStatePlay()
	const dispatch = useDispatch()
	const volume = useStateVolume()

	const audio =	useAudio()
	const autoLoad = useRef(false)

	const [ expand, setExpand ] =
		useState(false)

	const [ nextQueueSong ] =
		useNextQueueSong()

	const { data } =
		useQuery<QueryData>(GET_NOW_PLAYING)

	const nowPlaying: NowPlaying =
		data?.getQueue.nowPlaying || null

	useEffect(() => {
		if (nowPlaying) {
			if (autoLoad.current && play) {
				audio.load({
					xhr: XHR_OPTIONS,
					volume: volume / 100,
					src: createCatalogMP3URL(nowPlaying.songID),
				})
			} else if (!autoLoad.current) {
				autoLoad.current = true
			}
		}
	}, [nowPlaying, play, autoLoad.current])

	useEffect(() => {
		if (nowPlaying) {
			if (audio.ready) {
				if (play) {
					audio.play()
				} else {
					audio.pause()
				}
			}
		}
	}, [audio.ready, play])

	useEffect(() => {
		if (isNull(data?.getQueue.nowPlaying) && !autoLoad.current) {
			autoLoad.current = true
		}
	}, [data])

	useEffect(() => {
		if (nowPlaying) {
			audio.volume(volume / 100)
		}
	}, [volume])

	useEffect(() => {
		if (nowPlaying) {
			if (audio.ended) {
				void nextQueueSong()
			}
		}
	}, [audio.ended])

	useEffect(() => {
		if (nowPlaying) {
			if (audio.error) {
				dispatch(addError({
					errorID: uniqueID(),
					location: "useSongAudio",
					message: audio.error.message,
				}))
			}
		}
	}, [audio.error])

	const handleExpandOpen =
		() => setExpand(true)

	const handleExpandClose =
		() => setExpand(false)

	return (
		<footer className={bem("", "BorderTop")}>
			<Controls
				audio={audio}
				nowPlaying={nowPlaying}
				className={bem("controls")}
				buttonClassName={bem("controls-button")}
				buttonIconClassName={bem("controls-button-icon")}
			/>
			<div className={bem("main", "PaddingHalf")}>
				<div className={bem("main-content-wrapper")}>
					<div className={bem("main-content")}>
						{nowPlaying ? (
							<Fragment>
								<Song
									hidePlay
									hidePlays
									hideDuration
									hideTrackNumber
									className={null}
									song={nowPlaying}
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
					audio={audio}
					nowPlaying={nowPlaying}
				/>
			</div>
			{nowPlaying && (
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
				audio={audio}
				nowPlaying={nowPlaying}
				onClose={handleExpandClose}
			/>
		</footer>
	)
}

interface QueryData {
	getQueue: QueueNowPlaying,
}

export default Bar