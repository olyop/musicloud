import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import isUndefined from "lodash/isUndefined"
import Metadata from "@oly_op/react-metadata"

import { User, Song } from "../../types"
import Songs from "../../components/songs"
import { updatePlay, useDispatch } from "../../redux"
import { useQuery, useMutation, useResetPlayer } from "../../hooks"
import GET_TOP_ONE_HUNDRED_SONGS from "./get-top-one-hundred-songs.gql"
import PLAY_TOP_ONE_HUNDRED_SONGS from "./play-top-one-hundred-songs.gql"

const TopOneHundredSongsPage: FC = () => {
	const dispatch = useDispatch()
	const resetPlayer = useResetPlayer()
	const { data } = useQuery<QueryData>(GET_TOP_ONE_HUNDRED_SONGS)
	const [ play, { loading } ] = useMutation<MutationData>(PLAY_TOP_ONE_HUNDRED_SONGS)

	const handlePlay =
		async () => {
			if (!loading) {
				resetPlayer()
				await play()
				dispatch(updatePlay(true))
			}
		}

	return (
		<Metadata title="#100 Songs">
			<div className="Content PaddingTopBottom">
				<div className="FlexListGapHalf MarginBottom">
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
						hideOrderBy
						hideDuration
						hideTrackNumber
						songs={data.topOneHundredSongs}
					/>
				)}
			</div>
		</Metadata>
	)
}

interface QueryData {
	topOneHundredSongs: Song[],
}

interface MutationData {
	playTopOneHundredSongs: User,
}

export default TopOneHundredSongsPage