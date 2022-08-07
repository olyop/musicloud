import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { createElement, FC } from "react"

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
import Page from "../../layouts/page"
import NowPlaying from "./now-playing"
import { useMutation, useResetPlayer } from "../../hooks"

import CLEAR_QUEUES from "./clear-queues.gql"
import SHUFFLE_NEXT from "./shuffle-next.gql"
import GET_QUEUE_NEXT from "./get-queue-next.gql"
import GET_QUEUE_LATER from "./get-queue-later.gql"
import CLEAR_NEXT_QUEUES from "./clear-next-queues.gql"
import GET_QUEUE_PREVIOUS from "./get-queue-previous.gql"

import "./index.scss"

const bem =
	createBEM("Queues")

const Queues: FC = () => {
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
					__typename: "Queue",
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
					__typename: "Queue",
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

	const areQueuesCollapsed =
		queuesDisclosure.next ||
		queuesDisclosure.later ||
		queuesDisclosure.previous

	const header = (
		<div className={bem("navigation", "FlexRowGapHalf")}>
			<div className="FlexRowGapHalf">
				<Button
					icon="shuffle"
					text="Shuffle"
					onClick={handleShuffleNext}
				/>
				<Button
					icon="clear_all"
					text="Clear Next"
					onClick={handleClearNextQueues}
				/>
				<Button
					icon="close"
					text="Clear"
					onClick={handleClearQueues}
				/>
			</div>
			<Button
				icon={areQueuesCollapsed ? "unfold_more" : "unfold_less"}
				onClick={areQueuesCollapsed ? handleCollapseDisclosure : handleExpandDisclosure}
			/>
		</div>
	)

	return (
		<Head pageTitle="Queue">
			<Page header={header}>
				<div className="Content PaddingTopBottom">
					<div className="Elevated FlexColumn">
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
				</div>
			</Page>
		</Head>
	)
}

export default Queues