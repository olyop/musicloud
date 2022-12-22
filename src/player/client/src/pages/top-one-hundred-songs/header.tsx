import Button from "@oly_op/react-button";
import { FC, Fragment, createElement } from "react";

import { updateNowPlayingMutationFunction } from "../../helpers";
import { useMutation, useResetPlayer, useShare } from "../../hooks";
import { Queue } from "../../types";
import PLAY_TOP_ONE_HUNDRED_SONGS from "./play-top-one-hundred-songs.gql";
import SHUFFLE_TOP_ONE_HUNDRED_SONGS from "./shuffle-top-one-hundred-songs.gql";

const Header: FC = () => {
	const resetPlayer = useResetPlayer();

	const [share, { shareIcon, shareText }] = useShare();

	const [playTopOneHundredSongs] = useMutation<PlayData>(PLAY_TOP_ONE_HUNDRED_SONGS, {
		update: updateNowPlayingMutationFunction(data => data.playTopOneHundredSongs.nowPlaying),
	});

	const [shuffleTopOneHundredSongs] = useMutation<ShuffleData>(SHUFFLE_TOP_ONE_HUNDRED_SONGS, {
		update: updateNowPlayingMutationFunction(data => data.shuffleTopOneHundredSongs.nowPlaying),
	});

	const handlePlay = () => {
		resetPlayer();
		void playTopOneHundredSongs();
	};

	const handleShuffle = () => {
		resetPlayer();
		void shuffleTopOneHundredSongs();
	};

	const handleShare = () => {
		void share({
			title: "Top #100",
			url: "/top-one-hundred-songs",
		});
	};

	return (
		<Fragment>
			<div className="FlexRowGapHalf">
				<Button transparent text="Play" icon="play_arrow" className="Border" onClick={handlePlay} />
				<Button
					transparent
					icon="shuffle"
					text="Shuffle"
					className="Border"
					onClick={handleShuffle}
				/>
			</div>
			<Button transparent icon={shareIcon} onClick={handleShare} text={shareText || undefined} />
		</Fragment>
	);
};

interface PlayData {
	playTopOneHundredSongs: Queue;
}

interface ShuffleData {
	shuffleTopOneHundredSongs: Queue;
}

export default Header;
