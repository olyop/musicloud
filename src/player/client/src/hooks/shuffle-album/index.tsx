import { AlbumID } from "@oly_op/musicloud-common/build/types";
import { useEffect } from "react";

import { updateNowPlayingMutationFunction } from "../../helpers";
import { updatePlay, useDispatch } from "../../redux";
import { QueueNowPlaying } from "../../types";
import { useMutation } from "../mutation";
import { useResetPlayer } from "../reset-player";
import SHUFFLE_ALBUM from "./shuffle-album.gql";

export const useShuffleAlbum = ({ albumID }: AlbumID) => {
	const dispatch = useDispatch();
	const resetPlayer = useResetPlayer();

	const [shuffleAlbum, result] = useMutation<Data, AlbumID>(SHUFFLE_ALBUM, {
		variables: { albumID },
		update: updateNowPlayingMutationFunction(({ shuffleAlbum: { nowPlaying } }) => nowPlaying),
	});

	const handler = () => {
		if (!result.loading) {
			resetPlayer();
			void shuffleAlbum();
		}
	};

	useEffect(() => {
		if (result.data) {
			dispatch(updatePlay(true));
		}
	}, [result.data]);

	return [handler, result] as const;
};

interface Data {
	shuffleAlbum: QueueNowPlaying;
}
