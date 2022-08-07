import isNull from "lodash-es/isNull"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import { Modifier } from "@apollo/client/cache/core/types/common"

import { QueuePropTypes } from "../types"
import Song from "../../../components/song"
import Songs from "../../../components/songs"
import { Queue as QueueType, Song as SongType, SongQueueIndex } from "../../../types"
import { useDispatch, toggleQueueDisclosure, useStateQueuesDisclosure } from "../../../redux"
import { useQuery, useMutation, useRemoveSongFromQueueNext, useRemoveSongFromQueueLater } from "../../../hooks"

import JUMP_TO_SONG_IN_QUEUE_NEXT from "./jump-to-song-in-queue-next.gql"
import JUMP_TO_SONG_IN_QUEUE_LATER from "./jump-to-song-in-queue-later.gql"

import "./index.scss"

const bem =
	createBEM("Queue")

const removeFromQueueModifier =
	(queueIndex: number): Modifier<SongType[]> =>
		(existing: SongType[] = []) =>
			existing.filter(song => song.queueIndex !== queueIndex)

const Queue: FC<QueuePropTypes> = ({ name, query, queueKey, className }) => {
	const dispatch = useDispatch()
	const queuesDisclosure = useStateQueuesDisclosure()

	const { data } =
		useQuery<Data>(query)

	const [ removeNext ] =
		useRemoveSongFromQueueNext()

	const [ removeLater ] =
		useRemoveSongFromQueueLater()

	const [ jumpNext ] =
		useMutation<unknown, { index: number }>(
			JUMP_TO_SONG_IN_QUEUE_NEXT,
		)

	const [ jumpLater ] =
		useMutation<unknown, { index: number }>(
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
									id: cache.identify({ __typename: "Queue" }),
									fields: {
										next: removeFromQueueModifier(queueIndex),
									},
								})
							},
						})
					} else if (queueKey === "later") {
						void removeLater({
							variables: { index: queueIndex },
							update: cache => {
								cache.modify({
									id: cache.identify({ __typename: "Queue" }),
									fields: {
										laters: removeFromQueueModifier(queueIndex),
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

	if (data) {
		const songs = data.getQueue[queueKey]
		return isNull(songs) ? null : (
			<div className={bem(className, "FlexColumn")}>
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
							song => song.queueIndex && (
								<Song
									hidePlay
									hidePlays
									song={song}
									onJump={handleJump(song)}
									onRemove={handleRemove(song)}
									key={`${song.queueIndex}_${song.songID}`}
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