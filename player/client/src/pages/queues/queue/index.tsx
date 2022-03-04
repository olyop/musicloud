import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import { isEmpty, orderBy } from "lodash-es"

import {
	Data,
	IndexVars,
	QueuePropTypes,
	RemoveNextData,
	RemoveLaterData,
} from "../types"

import {
	useDispatch,
	toggleQueueDisclosure,
	useStateQueuesDisclosure,
} from "../../../redux"

import { Song as SongType } from "../../../types"
import { useQuery, useMutation, useJWTPayload } from "../../../hooks"
import Songs, { SongChangeOptions } from "../../../components/songs"
import JUMP_TO_SONG_IN_QUEUE_NEXT from "./jump-to-song-in-queue-next.gql"
import JUMP_TO_SONG_IN_QUEUE_LATER from "./jump-to-song-in-queue-later.gql"
import REMOVE_SONG_FROM_QUEUE_NEXT from "./remove-song-from-queue-next.gql"
import REMOVE_SONG_FROM_QUEUE_LATER from "./remove-song-from-queue-later.gql"

import "./index.scss"

const bem =
	createBEM("Queue")

const Queue: VFC<QueuePropTypes> = ({ name, query, queueKey, className }) => {
	const dispatch = useDispatch()
	const { userID } = useJWTPayload()
	const queuesDisclosure = useStateQueuesDisclosure()

	const { data } =
		useQuery<Data>(query)

	const [ removeNext ] =
		useMutation<RemoveNextData, IndexVars>(
			REMOVE_SONG_FROM_QUEUE_NEXT,
		)

	const [ removeLater ] =
		useMutation<RemoveLaterData, IndexVars>(
			REMOVE_SONG_FROM_QUEUE_LATER,
		)

	const [ jumpNext ] =
		useMutation<unknown, IndexVars>(
			JUMP_TO_SONG_IN_QUEUE_NEXT,
		)

	const [ jumpLater ] =
		useMutation<unknown, IndexVars>(
			JUMP_TO_SONG_IN_QUEUE_LATER,
		)

	const handleUpdateDisclosure =
		() => {
			dispatch(toggleQueueDisclosure(queueKey))
		}

	const handleRemove =
		({ index }: SongChangeOptions) =>
			async () => {
				if (queueKey === "next") {
					await removeNext({
						variables: { index },
						update: cache => {
							cache.modify({
								id: cache.identify({ userID, __typename: "User" }),
								fields: {
									queueNext:
										(exisiting: SongType[] = []) =>
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
									queueLaters:
										(exisiting: SongType[] = []) =>
											exisiting.filter(song => song.queueIndex !== index),
								},
							})
						},
					})
				}
			}

	const handleJump =
		({ index }: SongChangeOptions) =>
			async () => {
				if (queueKey === "next") {
					await jumpNext({
						variables: { index },
					})
				} else if (queueKey === "later") {
					await jumpLater({
						variables: { index },
					})
				}
			}

	return data && !isEmpty(data.getQueue[queueKey]) ? (
		<div className={bem(className, "FlexColumn ItemBorder")}>
			<Button
				text={name}
				transparent
				className={bem("expand")}
				onClick={handleUpdateDisclosure}
				icon={queuesDisclosure[queueKey] ? "expand_more" : "chevron_right"}
			/>
			{queuesDisclosure[queueKey] && (
				<Songs
					hidePlay
					hidePlays
					hideIndex
					hideElevated
					orderBy={false}
					onJump={handleJump}
					onRemove={handleRemove}
					className={bem("section")}
					songs={orderBy(data.getQueue[queueKey], "queueIndex")}
				/>
			)}
		</div>
	) : null
}

export default Queue