import { useEffect } from "react";
import isNull from "lodash-es/isNull";
import isUndefined from "lodash-es/isUndefined";
import { SongID } from "@oly_op/musicloud-common/build/types";

import { Song } from "../../types";
import { useQuery } from "../query";
import { useMutation } from "../mutation";
import { useResetPlayer } from "../reset-player";
import useUpdatePlaysTotal from "./use-update-plays-total";
import { updateNowPlayingMutationFunction } from "../../helpers";
import { togglePlay, updatePlay, useDispatch } from "../../redux";
import { Input, GetQueueNowPlayingData, PlaySongData } from "./types";

import PLAY_SONG from "./play-song.gql";
import GET_QUEUE_NOW_PLAYING_SONG_ID from "./get-queue-now-playing-song-id.gql";

const isSong = (song: Input): song is Song => (isNull(song) ? false : "__typename" in song);

export const usePlaySong = (song: Input) => {
	const dispatch = useDispatch();
	const resetPlayer = useResetPlayer();
	const updatePlaysTotalCache = useUpdatePlaysTotal(song);

	const { data: nowPlayingData } = useQuery<GetQueueNowPlayingData>(GET_QUEUE_NOW_PLAYING_SONG_ID, {
		fetchPolicy: "cache-and-network",
	});

	const isSongNotNull = !isNull(song);

	const isPlaying =
		isSongNotNull &&
		!isUndefined(nowPlayingData) &&
		!isNull(nowPlayingData.getQueue.nowPlaying) &&
		nowPlayingData.getQueue.nowPlaying.songID === song.songID;

	const [playSong, result] = useMutation<PlaySongData, SongID>(PLAY_SONG, {
		errorPolicy: "ignore",
		fetchPolicy: "network-only",
		optimisticResponse: isSong(song)
			? {
					playSong: {
						__typename: "Queue",
						nowPlaying: song,
					},
			  }
			: undefined,
		update: updateNowPlayingMutationFunction(data => data.playSong.nowPlaying),
		onCompleted: updatePlaysTotalCache,
	});

	const handler = () => {
		if (isSongNotNull) {
			if (isPlaying) {
				dispatch(togglePlay());
			} else {
				resetPlayer();
				void playSong({
					variables: { songID: song.songID },
				});
			}
		}
	};

	useEffect(() => {
		if (result.data) {
			dispatch(updatePlay(true));
		}
	}, [result.data]);

	return [handler, isPlaying, result] as const;
};
