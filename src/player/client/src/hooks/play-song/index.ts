import { SongID } from "@oly_op/musicloud-common/build/types";
import isNull from "lodash-es/isNull";
import isUndefined from "lodash-es/isUndefined";

import { useApolloClient } from "../../apollo";
import { updateNowPlayingMutationFunction } from "../../helpers";
import { togglePlay, updatePlay, useDispatch } from "../../redux";
import { Song } from "../../types";
import { useMutation } from "../mutation";
import { useQuery } from "../query";
import { useResetPlayer } from "../reset-player";
import GET_QUEUE_NOW_PLAYING_SONG_ID from "./get-queue-now-playing-song-id.gql";
import PLAY_SONG from "./play-song.gql";
import { GetQueueNowPlayingData, Input, PlaySongData } from "./types";
import useUpdatePlaysTotal from "./use-update-plays-total";

const isSong = (song: Input): song is Song => (isNull(song) ? false : "__typename" in song);

export const usePlaySong = (song: Input) => {
	const dispatch = useDispatch();
	const apollo = useApolloClient();
	const resetPlayer = useResetPlayer();
	const updatePlaysTotalCache = useUpdatePlaysTotal(song);

	const { data: nowPlayingData } = useQuery<GetQueueNowPlayingData>(GET_QUEUE_NOW_PLAYING_SONG_ID);

	const isSongNotNull = !isNull(song);

	const isPlaying =
		isSongNotNull &&
		!isUndefined(nowPlayingData) &&
		!isNull(nowPlayingData.getQueue.nowPlaying) &&
		nowPlayingData.getQueue.nowPlaying.songID === song.songID;

	const updateCache = (data: PlaySongData) => {
		updatePlaysTotalCache();
		updateNowPlayingMutationFunction<PlaySongData, SongID, unknown>(
			({ playSong: { nowPlaying } }) => nowPlaying,
		)(apollo.cache, { data }, {});
		dispatch(updatePlay(true));
	};

	const optimisticResponse: PlaySongData | undefined = isSong(song)
		? {
				playSong: {
					__typename: "Queue",
					nowPlaying: song,
				},
		  }
		: undefined;

	const [playSong, result] = useMutation<PlaySongData, SongID>(PLAY_SONG, {
		optimisticResponse,
		errorPolicy: "ignore",
		onError: () => {
			if (optimisticResponse) {
				updateCache(optimisticResponse);
			}
		},
		onCompleted: data => {
			updateCache(data);
		},
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

	return [handler, isPlaying, result] as const;
};
