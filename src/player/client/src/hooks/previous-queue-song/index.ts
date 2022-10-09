import { useEffect } from "react";

import { useMutation } from "../mutation";
import { QueueNowPlaying } from "../../types";
import { useResetPlayer } from "../reset-player";
import { updatePlay, useDispatch } from "../../redux";
import { updateNowPlayingMutationFunction } from "../../helpers";

import PREVIOUS_QUEUE_SONG from "./previous-queue-song.gql";

export const usePreviousQueueSong = () => {
	const dispatch = useDispatch();
	const resetPlayer = useResetPlayer();

	const [previousQueueSong, result] = useMutation<Data>(PREVIOUS_QUEUE_SONG, {
		update: updateNowPlayingMutationFunction(({ previousQueueSong: { nowPlaying } }) => nowPlaying),
	});

	const handlePreviousClick = () => {
		if (!result.loading) {
			resetPlayer();
			void previousQueueSong();
		}
	};

	useEffect(() => {
		if (result.data) {
			dispatch(updatePlay(true));
		}
	}, [result.data]);

	return [handlePreviousClick, result] as const;
};

interface Data {
	previousQueueSong: QueueNowPlaying;
}
