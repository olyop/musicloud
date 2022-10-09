import { useEffect } from "react";
import isNull from "lodash-es/isNull";
import isUndefined from "lodash-es/isUndefined";
import { AlbumID } from "@oly_op/musicloud-common/build/types";

import { useQuery } from "../query";
import { useMutation } from "../mutation";
import { QueueNowPlaying } from "../../types";
import { useResetPlayer } from "../reset-player";
import { updateNowPlayingMutationFunction } from "../../helpers";
import { useDispatch, togglePlay, updatePlay } from "../../redux";

import PLAY_ALBUM from "./play-album.gql";
import GET_ALBUM_NOW_PLAYING from "./get-album-now-playing.gql";

export const usePlayAlbum = (album: AlbumID | null) => {
	const dispatch = useDispatch();
	const resetPlayer = useResetPlayer();

	const [playAlbum, result] = useMutation<PlayAlbumData, AlbumID>(PLAY_ALBUM, {
		update: updateNowPlayingMutationFunction(({ playAlbum: { nowPlaying } }) => nowPlaying),
	});

	const { data } = useQuery<GetQueueNowPlayingData>(GET_ALBUM_NOW_PLAYING, {
		fetchPolicy: "cache-first",
	});

	const isAlbumNotNull = !isNull(album);

	const isPlaying =
		isAlbumNotNull &&
		!isUndefined(data) &&
		!isNull(data.getQueue.nowPlaying) &&
		data.getQueue.nowPlaying.album.albumID === album.albumID;

	const handlePlayAlbum = () => {
		if (isAlbumNotNull) {
			if (isPlaying) {
				dispatch(togglePlay());
			} else {
				resetPlayer();
				void playAlbum({
					variables: { albumID: album.albumID },
				});
			}
		}
	};

	useEffect(() => {
		if (result.data) {
			dispatch(updatePlay(true));
		}
	}, [result.data]);

	return [handlePlayAlbum, isPlaying, result] as const;
};

interface PlayAlbumData {
	playAlbum: QueueNowPlaying;
}

interface GetQueueNowPlayingData {
	getQueue: QueueNowPlaying;
}
