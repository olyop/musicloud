import isEmpty from "lodash/isEmpty"
import orderBy from "lodash/orderBy"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import Metadata from "@oly_op/react-metadata"

import {
	Data,
	RemoveVars,
	QueuePropTypes,
	RemoveNextData,
	ClearQueuesData,
	RemoveLaterData,
	ShuffleNextData,
	ClearNextQueuesData,
} from "./types"

import {
	useDispatch,
	toggleQueueDisclosure,
	expandQueuesDisclosure,
	collapseQueuesDisclosure,
	useStateQueuesDisclosure,
} from "../../redux"

import Song from "../../components/song"
import SHUFFLE_NEXT from "./shuffle-next.gql"
import CLEAR_QUEUES from "./clear-queues.gql"
import { Song as SongType } from "../../types"
import GET_QUEUE_NEXT from "./get-queue-next.gql"
import GET_QUEUE_LATER from "./get-queue-later.gql"
import CLEAR_NEXT_QUEUES from "./clear-next-queues.gql"
import GET_QUEUE_PREVIOUS from "./get-queue-previous.gql"
import { useQuery, useMutation, useUserID } from "../../hooks"
import Songs, { OnRemoveOptions } from "../../components/songs"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"
import REMOVE_SONG_FROM_QUEUE_NEXT from "./remove-song-from-queue-next.gql"
import REMOVE_SONG_FROM_QUEUE_LATER from "./remove-song-from-queue-later.gql"

import "./index.scss"

const bem =
	createBEM("Queues")

const NowPlaying: FC = () => {
	const { data } =
		useQuery<Data>(GET_QUEUE_NOW_PLAYING)
	return data?.getQueue.nowPlaying ? (
		<Song
			hidePlay
			hidePlays
			hideTrackNumber
			song={data.getQueue.nowPlaying}
			className="Elevated PaddingHalf Rounded MarginBottom"
		/>
	) : null
}

const Queue: FC<QueuePropTypes> = ({ name, query, queueKey, className }) => {
	const userID = useUserID()
	const dispatch = useDispatch()
	const queuesDisclosure = useStateQueuesDisclosure()

	const { data } =
		useQuery<Data>(query)

	const [ removeNext ] =
		useMutation<RemoveNextData, RemoveVars>(
			REMOVE_SONG_FROM_QUEUE_NEXT,
		)

	const [ removeLater ] =
		useMutation<RemoveLaterData, RemoveVars>(
			REMOVE_SONG_FROM_QUEUE_LATER,
		)

	const handleUpdateDisclosure =
		() => {
			dispatch(toggleQueueDisclosure(queueKey))
		}

	const handleRemove =
		({ index }: OnRemoveOptions) =>
			async () => {
				if (queueKey === "next") {
					await removeNext({
						variables: { index },
						update: cache => {
							cache.modify({
								id: cache.identify({ userID, __typename: "User" }),
								fields: {
									queueNext: (exisiting: SongType[] = []) =>
										exisiting.filter(song => song.queueIndex !== index),
								},
							})
						},
					})
				} else if (queueKey === "later") {
					await removeLater({
						variables: { index },
						update: cache => {
							cache.modify({
								id: cache.identify({ userID, __typename: "User" }),
								fields: {
									queueLaters: (exisiting: SongType[] = []) =>
										exisiting.filter(song => song.queueIndex !== index),
								},
							})
						},
					})
				}
			}

	return (
		<div className={bem(className, "FlexColumn Rounded Elevated ItemBorder")}>
			<Button
				text={name}
				transparent
				className={bem("expand")}
				onClick={handleUpdateDisclosure}
				icon={queuesDisclosure[queueKey] ? "expand_more" : "chevron_right"}
			/>
			{(
				data &&
				!isEmpty(data.getQueue[queueKey]) &&
				queuesDisclosure[queueKey]
			) && (
				<Songs
					hidePlay
					hidePlays
					hideIndex
					hideElevated
					orderBy={false}
					onRemove={handleRemove}
					className={bem("section")}
					songs={orderBy(data.getQueue[queueKey], "queueIndex")}
				/>
			)}
		</div>
	)
}

const Queues: FC = () => {
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

	const handleRefresh =
		() => location.reload()

	const areQueuesCollapsed =
		queuesDisclosure.next &&
		queuesDisclosure.later &&
		queuesDisclosure.previous

	return (
		<Metadata title="Queue">
			<div className="Content PaddingTopBottom">
				<Queue
					name="Previous"
					queueKey="previous"
					className="MarginBottom"
					query={GET_QUEUE_PREVIOUS}
				/>
				<NowPlaying/>
				<Queue
					name="Next"
					queueKey="next"
					query={GET_QUEUE_NEXT}
					className="MarginBottom"
					removeQuery={REMOVE_SONG_FROM_QUEUE_NEXT}
				/>
				<Queue
					name="Later"
					queueKey="later"
					query={GET_QUEUE_LATER}
					removeQuery={REMOVE_SONG_FROM_QUEUE_LATER}
				/>
				<div className={bem("actions", "MarginTop")}>
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
					<Button
						transparent
						icon="refresh"
						onClick={handleRefresh}
						className={bem("actions-refresh")}
					/>
				</div>
			</div>
		</Metadata>
	)
}

export default Queues