import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import { useNavigate } from "react-router-dom"
import { Metadata } from "@oly_op/react-metadata"

import {
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
import NowPlaying from "./now-playing"
import SHUFFLE_NEXT from "./shuffle-next.gql"
import CLEAR_QUEUES from "./clear-queues.gql"
import Buttons from "../../components/buttons"
import GET_QUEUE_NEXT from "./get-queue-next.gql"
import GET_QUEUE_LATER from "./get-queue-later.gql"
import CLEAR_NEXT_QUEUES from "./clear-next-queues.gql"
import GET_QUEUE_PREVIOUS from "./get-queue-previous.gql"
import { useMutation, useResetPlayer } from "../../hooks"

import "./index.scss"

const Queues: VFC = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const resetPlayer = useResetPlayer()
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
		() => {
			void shuffleNext()
		}

	const handleClearNextQueues =
		() => {
			void clearNext()
			handleCollapseDisclosure()
		}

	const handleClearQueues =
		() => {
			void clear()
			handleCollapseDisclosure()
			resetPlayer()
		}

	const handleBack =
		() => navigate(-1)

	const areQueuesCollapsed =
		queuesDisclosure.next &&
		queuesDisclosure.later &&
		queuesDisclosure.previous

	return (
		<Metadata title="Queue">
			<div className="Content FlexColumnGap PaddingTopBottom">
				<div className="FlexRowGapQuart">
					<Button
						transparent
						icon="arrow_back"
						onClick={handleBack}
					/>
					<h1 className="HeadingFour">
						Queue
					</h1>
				</div>
				<div className="Elevated Queues">
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
				<Buttons>
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
				</Buttons>
			</div>
		</Metadata>
	)
}

export default Queues