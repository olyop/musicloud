import Button from "@oly_op/react-button"
import { createElement, FC, Fragment } from "react"

import Page from "../../components/page"
import { Song, Queue } from "../../types"
import Songs from "../../components/songs"
import { useQuery, useMutation, useResetPlayer } from "../../hooks"
import GET_TOP_ONE_HUNDRED_SONGS from "./get-top-one-hundred-songs.gql"
import PLAY_TOP_ONE_HUNDRED_SONGS from "./play-top-one-hundred-songs.gql"
import SHUFFLE_TOP_ONE_HUNDRED_SONGS from "./shuffle-top-one-hundred-songs.gql"

const TopOneHundredSongsPage: FC = () => {
	const resetPlayer = useResetPlayer()

	const { data } =
		useQuery<QueryData>(GET_TOP_ONE_HUNDRED_SONGS)

	const [ playTopOneHundredSongs ] =
		useMutation<MutationData>(PLAY_TOP_ONE_HUNDRED_SONGS)

	const [ shuffleTopOneHundredSongs ] =
		useMutation<MutationData>(SHUFFLE_TOP_ONE_HUNDRED_SONGS)

	const handlePlay =
		() => {
			resetPlayer()
			void playTopOneHundredSongs()
		}

	const handleShuffle =
		() => {
			resetPlayer()
			void shuffleTopOneHundredSongs()
		}

	return (
		<Page
			pageTitle="Top #100"
			headerClassName="FlexRowGapHalf"
			contentClassName="PaddingTopBottom"
			header={(
				<Fragment>
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
				</Fragment>
			)}
			content={data ? (
				<Songs
					hideDuration
					orderBy={false}
					hideTrackNumber
					className="Content"
					songs={data.getTopOneHundredSongs}
				/>
			) : undefined}
		/>
	)
}

interface QueryData {
	getTopOneHundredSongs: Song[],
}

interface MutationData {
	playTopOneHundredSongs: Queue,
}

export default TopOneHundredSongsPage