import { createElement, VFC } from "react"

import Song from "../../components/song"
import { useQuery } from "../../hooks"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"
import { QueueNowPlaying } from "../../types"

const NowPlaying: VFC = () => {
	const { data } = useQuery<Data>(GET_QUEUE_NOW_PLAYING)
	return data?.getQueue.nowPlaying ? (
		<Song
			hidePlays
			shareIcon
			hideTrackNumber
			leftIcon="double_arrow"
			className="PaddingHalf"
			song={data.getQueue.nowPlaying}
		/>
	) : null
}

interface Data {
	getQueue: QueueNowPlaying,
}

export default NowPlaying