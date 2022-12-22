import { useEffect } from "react";

import { updateNowPlayingMutationFunction } from "../../helpers";
import { updatePlay, useDispatch } from "../../redux";
import { QueueNowPlaying } from "../../types";
import { useMutation } from "../mutation";
import { useResetPlayer } from "../reset-player";
import NEXT_QUEUE_SONG from "./next-queue-song.gql";

export const useNextQueueSong = () => {
	const dispatch = useDispatch();
	const resetPlayer = useResetPlayer();

	const [nextQueueSong, result] = useMutation<Data>(NEXT_QUEUE_SONG, {
		update: updateNowPlayingMutationFunction(({ nextQueueSong: { nowPlaying } }) => nowPlaying),
	});

	const handleNextClick = () => {
		if (!result.loading) {
			resetPlayer();
			void nextQueueSong();
		}
	};

	useEffect(() => {
		if (result.data) {
			dispatch(updatePlay(true));
		}
	}, [result.data]);

	return [handleNextClick, result] as const;
};

interface Data {
	nextQueueSong: QueueNowPlaying;
}
