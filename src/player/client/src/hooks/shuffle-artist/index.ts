import { ArtistID } from "@oly_op/musicloud-common/build/types";
import { useEffect } from "react";

import { updateNowPlayingMutationFunction } from "../../helpers";
import { updatePlay, useDispatch } from "../../redux";
import { QueueNowPlaying } from "../../types";
import { useMutation } from "../mutation";
import { useResetPlayer } from "../reset-player";
import SHUFFLE_ARTIST from "./shuffle-artist.gql";

export const useShuffleArtist = (artist: ArtistID | null) => {
	const dispatch = useDispatch();
	const resetPlayer = useResetPlayer();

	const [shuffleArtist, result] = useMutation<Data, ArtistID>(SHUFFLE_ARTIST, {
		update: updateNowPlayingMutationFunction(({ shuffleArtist: { nowPlaying } }) => nowPlaying),
	});

	const handler = () => {
		if (artist) {
			resetPlayer();
			void shuffleArtist({
				variables: {
					artistID: artist.artistID,
				},
			});
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
	shuffleArtist: QueueNowPlaying;
}
