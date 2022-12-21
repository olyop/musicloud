import Button from "@oly_op/react-button";
import { FC, createElement } from "react";

import { updateNowPlayingMutationFunction } from "../../helpers";
import { useMutation, useResetPlayer } from "../../hooks";
import { updatePlay, useDispatch } from "../../redux";
import { QueueNowPlaying } from "../../types";
import SHUFFLE_LIBRARY from "./shuffle-library.gql";

const ShuffleButton: FC<PropTypes> = ({ hideButtonText }) => {
	const dispatch = useDispatch();
	const resetPlayer = useResetPlayer();

	const [shuffleLibrary] = useMutation<Data>(SHUFFLE_LIBRARY, {
		update: updateNowPlayingMutationFunction(data => data.shuffleLibrary.nowPlaying),
	});

	const handleShuffleLibrary = async () => {
		resetPlayer();
		await shuffleLibrary();
		dispatch(updatePlay(true));
	};

	const handleClick = () => {
		void handleShuffleLibrary();
	};

	return (
		<Button
			icon="shuffle"
			title="Shuffle"
			onClick={handleClick}
			text={hideButtonText ? undefined : "Shuffle"}
		/>
	);
};

interface Data {
	shuffleLibrary: QueueNowPlaying;
}

interface PropTypes {
	hideButtonText: boolean;
}

export default ShuffleButton;
