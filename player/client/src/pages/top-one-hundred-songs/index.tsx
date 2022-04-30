import { isUndefined } from "lodash-es"
import Button from "@oly_op/react-button"
import { createElement, Fragment, FC } from "react"
import { Metadata } from "@oly_op/react-metadata"

import { Song, Queue } from "../../types"
import Songs from "../../components/songs"
import { useQuery, useMutation, useResetPlayer } from "../../hooks"
import GET_TOP_ONE_HUNDRED_SONGS from "./get-top-one-hundred-songs.gql"
import PLAY_TOP_ONE_HUNDRED_SONGS from "./play-top-one-hundred-songs.gql"
import SHUFFLE_TOP_ONE_HUNDRED_SONGS from "./shuffle-top-one-hundred-songs.gql"
import Window from "../../components/window"

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
		<Metadata title="#100 Songs">
			<div className="Content PaddingTopBottom">
				<div className="FlexRowGapHalf MarginBottom">
					<h1
						children="#100 Songs"
						className="HeadingFour"
						style={{ marginTop: -3 }}
					/>
					<Window>
						{({ width }) => (
							<Fragment>
								<Button
									transparent
									icon="play_arrow"
									className="Border"
									onClick={handlePlay}
									text={width <= 500 ? undefined : "Play"}
								/>
								<Button
									transparent
									icon="shuffle"
									className="Border"
									onClick={handleShuffle}
									text={width <= 500 ? undefined : "Shuffle"}
								/>
							</Fragment>
						)}
					</Window>
				</div>
				{!isUndefined(data) && (
					<Songs
						hideDuration
						orderBy={false}
						hideTrackNumber
						songs={data.getTopOneHundredSongs}
					/>
				)}
			</div>
		</Metadata>
	)
}

interface QueryData {
	getTopOneHundredSongs: Song[],
}

interface MutationData {
	playTopOneHundredSongs: Queue,
}

export default TopOneHundredSongsPage