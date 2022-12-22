import { FC, createElement } from "react";

import Song from "../../components/song";
import GET_QUEUE_NOW_PLAYING from "../../graphql/queries/get-queue-now-playing.gql";
import { useQuery } from "../../hooks";
import { QueueNowPlaying } from "../../types";

const NowPlaying: FC = () => {
	const { data } = useQuery<Data>(GET_QUEUE_NOW_PLAYING);
	return data?.getQueue.nowPlaying ? (
		<Song
			hidePlays
			shareIcon
			hideTrackNumber
			leftIcon="double_arrow"
			song={data.getQueue.nowPlaying}
			className="PaddingHalf MarginBottom"
		/>
	) : null;
};

interface Data {
	getQueue: QueueNowPlaying;
}

export default NowPlaying;
