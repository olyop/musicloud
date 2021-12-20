import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import isUndefined from "lodash/isUndefined"
import { Metadata } from "@oly_op/react-metadata"

import { Song, Queue } from "../../types"
import Songs from "../../components/songs"
import { useDispatch } from "../../redux"
import { useQuery, useMutation, useResetPlayer } from "../../hooks"
import GET_TOP_ONE_HUNDRED_SONGS from "./get-top-one-hundred-songs.gql"
import PLAY_TOP_ONE_HUNDRED_SONGS from "./play-top-one-hundred-songs.gql"

const TopOneHundredSongsPage: VFC = () => {
	const dispatch = useDispatch()
	const resetPlayer = useResetPlayer()

	const { data } =
		useQuery<QueryData>(GET_TOP_ONE_HUNDRED_SONGS)

	const [ playTopOneHundredSongs, { loading } ] =
		useMutation<MutationData>(PLAY_TOP_ONE_HUNDRED_SONGS)

	const handlePlay =
		async () => {
			if (!loading) {
				resetPlayer()
				await playTopOneHundredSongs()
			}
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
					<Button
						text="Play"
						transparent
						icon="play_arrow"
						className="Border"
						onClick={handlePlay}
					/>
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