import isEmpty from "lodash/isEmpty"
import orderBy from "lodash/orderBy"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import Metadata from "@oly_op/react-metadata"
import { createElement, FC, Fragment } from "react"

import {
	RemoveVars,
	NowPlayingData,
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
import { getUserID } from "../../helpers"
import SHUFFLE_NEXT from "./shuffle-next.gql"
import CLEAR_QUEUES from "./clear-queues.gql"
import { Song as SongType } from "../../types"
import GET_QUEUE_NEXT from "./get-queue-next.gql"
import GET_QUEUE_LATER from "./get-queue-later.gql"
import { useQuery, useMutation } from "../../hooks"
import CLEAR_NEXT_QUEUES from "./clear-next-queues.gql"
import GET_QUEUE_PREVIOUS from "./get-queue-previous.gql"
import GET_USER_NOW_PLAYING from "./get-user-now-playing.gql"
import Songs, { OnRemoveOptions } from "../../components/songs"
import REMOVE_SONG_FROM_QUEUE_NEXT from "./remove-song-from-queue-next.gql"
import REMOVE_SONG_FROM_QUEUE_LATER from "./remove-song-from-queue-later.gql"

import "./index.scss"

const bem =
	createBEM("Queues")

const Queue: FC<QueuePropTypes> = ({ name, query, queueKey, className }) => {
	const userID = getUserID()
	const dispatch = useDispatch()
	const queuesDisclosure = useStateQueuesDisclosure()

	const { data } =
		useQuery<NowPlayingData>(
			query,
			{ fetchPolicy: "network-only" },
		)

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

	const handleJump =
		({ index }: OnRemoveOptions) =>
			async () => {
				console.log({ index })
			}

	const handleRemove =
		({ index }: OnRemoveOptions) =>
			async () => {
				if (queueKey === "queueNext") {
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
				} else if (queueKey === "queueLater") {
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
				!isEmpty(data.user[queueKey]) &&
				queuesDisclosure[queueKey]
			) && (
				<Songs
					hidePlays
					hideIndex
					hideOrderBy
					hideElevated
					onRemove={handleRemove}
					className={bem("section")}
					songs={orderBy(data.user[queueKey], "queueIndex")}
				/>
			)}
		</div>
	)
}

const Queues: FC = () => {
	const userID = getUserID()
	const dispatch = useDispatch()
	const queuesDisclosure = useStateQueuesDisclosure()

	const { data: nowPlayingData } =
		useQuery<NowPlayingData>(GET_USER_NOW_PLAYING, {
			fetchPolicy: "cache-first",
		})

	const [ shuffleNext ] =
		useMutation<ShuffleNextData>(SHUFFLE_NEXT)

	const [ clearNext ] =
		useMutation<ClearNextQueuesData>(CLEAR_NEXT_QUEUES, {
			optimisticResponse: {
				clearNextQueues: {
					userID,
					queueNext: [],
					queueLater: [],
					queuePrevious: [],
					__typename: "User",
				},
			},
		})

	const [ clear ] =
		useMutation<ClearQueuesData>(CLEAR_QUEUES, {
			optimisticResponse: {
				clearQueues: {
					userID,
					queueNext: [],
					queueLater: [],
					nowPlaying: null,
					queuePrevious: [],
					__typename: "User",
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
		queuesDisclosure.queueNext &&
		queuesDisclosure.queueLater &&
		queuesDisclosure.queuePrevious

	return (
		<Metadata title="Queue">
			<div className="Content PaddingTopBottom">
				{nowPlayingData?.user.nowPlaying && (
					<Fragment>
						<Queue
							name="Previous"
							queueKey="queuePrevious"
							className="MarginBottom"
							query={GET_QUEUE_PREVIOUS}
						/>
						<Song
							hidePlay
							hidePlays
							hideTrackNumber
							song={nowPlayingData.user.nowPlaying}
							className=" Elevated PaddingHalf Rounded MarginBottom"
						/>
						<Queue
							name="Next"
							queueKey="queueNext"
							query={GET_QUEUE_NEXT}
							className="MarginBottom"
							removeQuery={REMOVE_SONG_FROM_QUEUE_NEXT}
						/>
						<Queue
							name="Later"
							queueKey="queueLater"
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
					</Fragment>
				)}
			</div>
		</Metadata>
	)
}

export default Queues