import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { createElement, FC, Fragment } from "react"

import Page from "../../layouts/page"
import Song from "../../components/song"
import Songs from "../../components/songs"
import { updateNowPlayingCache } from "../../helpers"
import { Song as SongType, Queue } from "../../types"
import { useQuery, useMutation, useResetPlayer } from "../../hooks"

import GET_TOP_ONE_HUNDRED_SONGS from "./get-top-one-hundred-songs.gql"
import PLAY_TOP_ONE_HUNDRED_SONGS from "./play-top-one-hundred-songs.gql"
import SHUFFLE_TOP_ONE_HUNDRED_SONGS from "./shuffle-top-one-hundred-songs.gql"

const TopOneHundredSongsPage: FC = () => {
	const resetPlayer = useResetPlayer()

	const { data: topOneHundredSongsData } =
		useQuery<QueryData>(GET_TOP_ONE_HUNDRED_SONGS)

	const [ playTopOneHundredSongs ] =
		useMutation<PlayTopOneHundredSongsData>(PLAY_TOP_ONE_HUNDRED_SONGS, {
			update: (cache, { data }) => {
				if (data?.playTopOneHundredSongs.nowPlaying) {
					updateNowPlayingCache(cache)(data.playTopOneHundredSongs.nowPlaying)
				}
			},
		})

	const [ shuffleTopOneHundredSongs ] =
		useMutation<ShuffleTopOneHundredSongsData>(SHUFFLE_TOP_ONE_HUNDRED_SONGS, {
			update: (cache, { data }) => {
				if (data?.shuffleTopOneHundredSongs.nowPlaying) {
					updateNowPlayingCache(cache)(data.shuffleTopOneHundredSongs.nowPlaying)
				}
			},
		})

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
		<Head pageTitle="Top #100">
			<Page
				headerClassName="FlexRowGapHalf"
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
				children={(
					<div className="ContentPaddingTopBottom">
						<Songs songs={topOneHundredSongsData?.getTopOneHundredSongs}>
							{songs => songs.map(
								(song, index) => (
									<Song
										song={song}
										hideDuration
										hideTrackNumber
										index={index + 1}
										key={song.songID}
									/>
								),
							)}
						</Songs>
					</div>
				)}
			/>
		</Head>
	)
}

interface QueryData {
	getTopOneHundredSongs: SongType[],
}

interface PlayTopOneHundredSongsData {
	playTopOneHundredSongs: Queue,
}

interface ShuffleTopOneHundredSongsData {
	shuffleTopOneHundredSongs: Queue,
}

export default TopOneHundredSongsPage