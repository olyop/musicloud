import isNull from "lodash-es/isNull";
import { createBEM } from "@oly_op/bem";
import uniqueID from "lodash-es/uniqueId";
import { useAudioPlayer as useAudio } from "react-use-audio-player";
import { useState, useEffect, useRef, createElement, FC } from "react";

import Main from "./main";
import Controls from "./controls";
import { NowPlaying } from "./types";
import Fullscreen from "./fullscreen";
import XHR_OPTIONS from "./xhr-options";
import { QueueNowPlaying } from "../../types";
import { createCatalogMP3URL } from "../../helpers";
import { useNextQueueSong, useQuery } from "../../hooks";
import { addError, useDispatch, useStatePlay, useStateVolume } from "../../redux";

import GET_NOW_PLAYING from "./get-now-playing.gql";

import "./index.scss";

const bem = createBEM("Bar");

/*
 *	WARNING!!
 *	 Spaghetti code ahead
 */

const Bar: FC = () => {
	const audio = useAudio();
	const play = useStatePlay();
	const dispatch = useDispatch();
	const autoLoad = useRef(false);
	const volume = useStateVolume();

	const { data } = useQuery<QueryData>(GET_NOW_PLAYING, {
		errorPolicy: "all",
		fetchPolicy: "cache-only",
	});

	const nowPlaying: NowPlaying = data?.getQueue.nowPlaying || null;

	useEffect(() => {
		if (nowPlaying) {
			if (autoLoad.current && play) {
				audio.load({
					xhr: XHR_OPTIONS,
					volume: volume / 100,
					src: createCatalogMP3URL(nowPlaying.songID),
				});
			} else if (!autoLoad.current) {
				autoLoad.current = true;
			}
		}
	}, [nowPlaying, play, autoLoad.current]);

	useEffect(() => {
		if (nowPlaying) {
			if (audio.ready) {
				if (play) {
					audio.play();
				} else {
					audio.pause();
				}
			}
		}
	}, [audio.ready, play]);

	useEffect(() => {
		if (isNull(data?.getQueue.nowPlaying) && !autoLoad.current) {
			autoLoad.current = true;
		}
	}, [data]);

	useEffect(() => {
		if (nowPlaying) {
			audio.volume(volume / 100);
		}
	}, [volume]);

	const [nextQueueSong] = useNextQueueSong();

	useEffect(() => {
		if (nowPlaying) {
			if (audio.ended) {
				void nextQueueSong();
			}
		}
	}, [audio.ended]);

	useEffect(() => {
		if (nowPlaying) {
			if (audio.error) {
				dispatch(
					addError({
						errorID: uniqueID(),
						location: "useSongAudio",
						message: audio.error.message,
					}),
				);
			}
		}
	}, [audio.error]);

	const [expand, setExpand] = useState(false);

	const handleExpandOpen = () => setExpand(true);

	const handleExpandClose = () => setExpand(false);

	return (
		<footer className={bem("", "BorderTop")}>
			<Controls
				audio={audio}
				nowPlaying={nowPlaying}
				className={bem("controls")}
				buttonClassName={bem("controls-button")}
				buttonIconClassName={bem("controls-button-icon")}
			/>
			<Main audio={audio} nowPlaying={nowPlaying} onExpandOpen={handleExpandOpen} />
			<Fullscreen
				open={expand}
				audio={audio}
				nowPlaying={nowPlaying}
				onOpen={handleExpandOpen}
				onClose={handleExpandClose}
			/>
		</footer>
	);
};

interface QueryData {
	getQueue: QueueNowPlaying;
}

export default Bar;
