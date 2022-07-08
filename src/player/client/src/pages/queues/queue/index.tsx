import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import { isEmpty, isNull } from "lodash-es"

import {
	IndexVars,
	QueuePropTypes,
	RemoveNextData,
	RemoveLaterData,
} from "../types"

import Song from "../../../components/song"
import Songs from "../../../components/songs"
import { useQuery, useMutation, useJWTPayload } from "../../../hooks"
import { Queue as QueueType, Song as SongType, SongQueueIndex } from "../../../types"
import { useDispatch, toggleQueueDisclosure, useStateQueuesDisclosure } from "../../../redux"

import JUMP_TO_SONG_IN_QUEUE_NEXT from "./jump-to-song-in-queue-next.gql"
import JUMP_TO_SONG_IN_QUEUE_LATER from "./jump-to-song-in-queue-later.gql"
import REMOVE_SONG_FROM_QUEUE_NEXT from "./remove-song-from-queue-next.gql"
import REMOVE_SONG_FROM_QUEUE_LATER from "./remove-song-from-queue-later.gql"

import "./index.scss"

const bem =
	createBEM("Queue")

const Queue: FC<QueuePropTypes> = ({ name, query, queueKey, className }) => {
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
		({ queueIndex }: SongQueueIndex) =>
			() => {
				if (!isNull(queueIndex)) {
					if (queueKey === "next") {
						void removeNext({
							variables: { index: queueIndex },
							update: cache => {
								cache.modify({
									id: cache.identify({ userID, __typename: "User" }),
									fields: {
										queueNext:
											(exisiting: SongType[] = []) =>
												exisiting.filter(song => song.queueIndex !== queueIndex),
									},
								})
							},
						})
					} else if (queueKey === "later") {
						void removeLater({
							variables: { index: queueIndex },
							update: cache => {
								cache.modify({
									id: cache.identify({ userID, __typename: "User" }),
									fields: {
										queueLaters:
											(exisiting: SongType[] = []) =>
												exisiting.filter(song => song.queueIndex !== queueIndex),
									},
								})
							},
						})
					}
				}
			}

	const handleJump =
		({ queueIndex }: SongQueueIndex) =>
			() => {
				if (!isNull(queueIndex)) {
					if (queueKey === "next") {
						void jumpNext({
							variables: { index: queueIndex },
						})
					} else if (queueKey === "later") {
						void jumpLater({
							variables: { index: queueIndex },
						})
					}
				}
			}

	if (data && !isEmpty(data.getQueue[queueKey])) {
		const songs = data.getQueue[queueKey]
		return (
			<div className={bem(className, "FlexColumn ItemBorder")}>
				<Button
					text={name}
					transparent
					className={bem("expand")}
					onClick={handleUpdateDisclosure}
					icon={queuesDisclosure[queueKey] ? "expand_more" : "chevron_right"}
				/>
				{queuesDisclosure[queueKey] && (
					<Songs hideElevated className={bem("section")}>
						{songs.map(
							song => (
								<Song
									hidePlay
									hidePlays
									song={song}
									key={song.queueIndex}
									onJump={handleJump(song)}
									onRemove={handleRemove(song)}
								/>
							),
						)}
					</Songs>
				)}
			</div>
		)
	} else {
		return null
	}
}

interface Data {
	getQueue: QueueType,
}

export default Queue