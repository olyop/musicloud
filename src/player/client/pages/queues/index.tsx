import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import { Metadata } from "@oly_op/react-metadata"

import {
	Data,
	ClearQueuesData,
	ShuffleNextData,
	ClearNextQueuesData,
} from "./types"

import {
	useDispatch,
	expandQueuesDisclosure,
	collapseQueuesDisclosure,
	useStateQueuesDisclosure,
} from "../../redux"

import Queue from "./queue"
import Song from "../../components/song"
import SHUFFLE_NEXT from "./shuffle-next.gql"
import CLEAR_QUEUES from "./clear-queues.gql"
import GET_QUEUE_NEXT from "./get-queue-next.gql"
import GET_QUEUE_LATER from "./get-queue-later.gql"
import { useQuery, useMutation } from "../../hooks"
import CLEAR_NEXT_QUEUES from "./clear-next-queues.gql"
import GET_QUEUE_PREVIOUS from "./get-queue-previous.gql"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"

import "./index.scss"

const NowPlaying: VFC = () => {
	const { data } =
		useQuery<Data>(GET_QUEUE_NOW_PLAYING)
	return data?.getQueue.nowPlaying ? (
		<Song
			hidePlay
			hidePlays
			hideTrackNumber
			leftIcon="double_arrow"
			className="PaddingHalf"
			song={data.getQueue.nowPlaying}
		/>
	) : null
}

const Queues: VFC = () => {
	const dispatch = useDispatch()
	const queuesDisclosure = useStateQueuesDisclosure()

	const [ shuffleNext ] =
		useMutation<ShuffleNextData>(SHUFFLE_NEXT)

	const [ clearNext ] =
		useMutation<ClearNextQueuesData>(CLEAR_NEXT_QUEUES, {
			optimisticResponse: {
				clearNextQueues: {
					next: [],
					later: [],
				},
			},
		})

	const [ clear ] =
		useMutation<ClearQueuesData>(CLEAR_QUEUES, {
			optimisticResponse: {
				clearQueues: {
					next: [],
					later: [],
					previous: [],
					nowPlaying: null,
				},
			},
		})

	const handleExpandDisclosure =
		() => {
			dispatch(expandQueuesDisclosure())
		}

	const handleCollapseDisclosure =
		() => {
			dispatch(collapseQueuesDisclosure())
		}

	const handleShuffleNext =
		async () => {
			await shuffleNext()
		}

	const handleClearNextQueues =
		async () => {
			await clearNext()
			handleCollapseDisclosure()
		}

	const handleClearQueues =
		async () => {
			await clear()
			handleCollapseDisclosure()
		}

	const areQueuesCollapsed =
		queuesDisclosure.next &&
		queuesDisclosure.later &&
		queuesDisclosure.previous

	return (
		<Metadata title="Queue">
			<div className="Content PaddingTopBottom">
				<div className="Elevated">
					<Queue
						name="Previous"
						queueKey="previous"
						query={GET_QUEUE_PREVIOUS}
					/>
					<NowPlaying/>
					<Queue
						name="Next"
						queueKey="next"
						query={GET_QUEUE_NEXT}
					/>
					<Queue
						name="Later"
						queueKey="later"
						query={GET_QUEUE_LATER}
					/>
				</div>
				<div className="Queues MarginTop FlexRowGapQuart">
					<Button
						text={areQueuesCollapsed ? "Collapse" : "Expand"}
						icon={areQueuesCollapsed ? "unfold_more" : "unfold_less"}
						onClick={areQueuesCollapsed ? handleCollapseDisclosure : handleExpandDisclosure}
					/>
					<Button
						icon="shuffle"
						text="Shuffle Next"
						onClick={handleShuffleNext}
					/>
					<Button
						icon="clear_all"
						text="Clear Next"
						onClick={handleClearNextQueues}
					/>
					<Button
						icon="close"
						text="Clear Queue"
						onClick={handleClearQueues}
					/>
				</div>
			</div>
		</Metadata>
	)
}

export default Queues