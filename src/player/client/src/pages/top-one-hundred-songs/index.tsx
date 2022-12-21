import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import { FC, Fragment, createElement } from "react";

import Song from "../../components/song";
import Songs from "../../components/songs";
import { formatPlays, updateNowPlayingMutationFunction } from "../../helpers";
import { useMutation, useQuery, useResetPlayer } from "../../hooks";
import Page from "../../layouts/page";
import { Queue, Song as SongType } from "../../types";
import GET_TOP_ONE_HUNDRED_SONGS from "./get-top-one-hundred-songs.gql";
import "./index.scss";
import PLAY_TOP_ONE_HUNDRED_SONGS from "./play-top-one-hundred-songs.gql";
import ShareButton from "./share-button";
import SHUFFLE_TOP_ONE_HUNDRED_SONGS from "./shuffle-top-one-hundred-songs.gql";

const TopOneHundredSongsPage: FC = () => {
	const resetPlayer = useResetPlayer();

	const { data: topOneHundredSongsData } = useQuery<QueryData>(GET_TOP_ONE_HUNDRED_SONGS, {
		fetchPolicy: "cache-and-network",
	});

	const [playTopOneHundredSongs] = useMutation<PlayTopOneHundredSongsData>(
		PLAY_TOP_ONE_HUNDRED_SONGS,
		{
			update: updateNowPlayingMutationFunction(data => data.playTopOneHundredSongs.nowPlaying),
		},
	);

	const [shuffleTopOneHundredSongs] = useMutation<ShuffleTopOneHundredSongsData>(
		SHUFFLE_TOP_ONE_HUNDRED_SONGS,
		{
			update: updateNowPlayingMutationFunction(data => data.shuffleTopOneHundredSongs.nowPlaying),
		},
	);

	const handlePlay = () => {
		resetPlayer();
		void playTopOneHundredSongs();
	};

	const handleShuffle = () => {
		resetPlayer();
		void shuffleTopOneHundredSongs();
	};

	return (
		<Head pageTitle="Top #100">
			<Page
				headerClassName="TopOneHundredSongsPage FlexRow"
				header={
					<Fragment>
						<div className="FlexRowGapHalf">
							<Button
								transparent
								text="Play"
								icon="play_arrow"
								className="Border"
								onClick={handlePlay}
							/>
							<Button
								transparent
								icon="shuffle"
								text="Shuffle"
								className="Border"
								onClick={handleShuffle}
							/>
						</div>
						<ShareButton />
					</Fragment>
				}
				children={
					topOneHundredSongsData ? (
						<div className="ContentPaddingTopBottom FlexColumnGap">
							<Songs songs={topOneHundredSongsData.getTopOneHundredSongs}>
								{songs =>
									songs.map((song, index) => (
										<Song
											song={song}
											hideDuration
											hideTrackNumber
											index={index + 1}
											key={song.songID}
										/>
									))
								}
							</Songs>
							<p className="ParagraphTwo LightColor">
								{formatPlays(topOneHundredSongsData.getPlaysTotal)}
								<Fragment> plays</Fragment>
							</p>
						</div>
					) : null
				}
			/>
		</Head>
	);
};

interface QueryData {
	getPlaysTotal: number;
	getTopOneHundredSongs: SongType[];
}

interface PlayTopOneHundredSongsData {
	playTopOneHundredSongs: Queue;
}

interface ShuffleTopOneHundredSongsData {
	shuffleTopOneHundredSongs: Queue;
}

export default TopOneHundredSongsPage;
