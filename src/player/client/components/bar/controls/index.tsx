import Button from "@oly_op/react-button"
import { createElement, FC, useEffect } from "react"
import { PureQueryOptions } from "@apollo/client"
import { createBEM, BEMInput } from "@oly_op/bem"

import { User } from "../../../types"
import NEXT_QUEUE_SONG from "./next-queue-song.gql"
import PREVIOUS_QUEUE_SONG from "./previous-queue-song.gql"
import GET_QUEUE_NEXT from "../../../pages/queues/get-queue-next.gql"
import GET_QUEUE_LATER from "../../../pages/queues/get-queue-later.gql"
import { useKeyPress, useMutation, useResetPlayer } from "../../../hooks"
import GET_QUEUE_PREVIOUS from "../../../pages/queues/get-queue-previous.gql"
import { togglePlay, updatePlay, useDispatch, useStatePlay } from "../../../redux"

import "./index.scss"

const bem =
	createBEM("BarControls")

const BarControls: FC<PropTypes> = ({
	className,
	buttonClassName,
	buttonIconClassName,
	hidePreviousNext = false,
}) => {
	const play = useStatePlay()
	const dispatch = useDispatch()
	const resetPlayer = useResetPlayer()

	const nextPress = useKeyPress("MediaTrackNext")
	const playPausePress = useKeyPress("MediaPlayPause")
	const previousPress = useKeyPress("MediaTrackPrevious")

	const refetchQueries: PureQueryOptions[] = [
		{ query: GET_QUEUE_NEXT },
		{ query: GET_QUEUE_LATER },
		{ query: GET_QUEUE_PREVIOUS },
	]

	const [ nextQueueSong, { loading: nextLoading } ] =
		useMutation<UserNextData>(NEXT_QUEUE_SONG, { refetchQueries })

	const [ previousQueueSong, { loading: previousLoading } ] =
		useMutation<UserPreviousData>(PREVIOUS_QUEUE_SONG, { refetchQueries })

	const loading =
		nextLoading || previousLoading

	const handlePlayClick =
		() => {
			dispatch(togglePlay())
		}

	const handleNextClick =
		async () => {
			resetPlayer()
			await nextQueueSong()
			dispatch(updatePlay(true))
		}

	const handlePreviousClick =
		async () => {
			resetPlayer()
			await previousQueueSong()
			dispatch(updatePlay(true))
		}

	const playButtonIcon =
		loading ?
			"loop" : (
				play ?
					"pause" :
					"play_arrow"
			)

	useEffect(() => {
		if (nextPress) {
			handleNextClick()
		}
	}, [nextPress])

	useEffect(() => {
		if (previousPress) {
			handlePreviousClick()
		}
	}, [previousPress])

	useEffect(() => {
		if (playPausePress) {
			dispatch(togglePlay())
		}
	}, [playPausePress])

	return (
		<div className={bem(className, "")}>
			{hidePreviousNext || (
				<Button
					transparent
					icon="skip_previous"
					className={buttonClassName}
					iconClassName={buttonIconClassName}
					onClick={loading ? undefined : handlePreviousClick}
				/>
			)}
			<Button
				icon={playButtonIcon}
				iconClassName={bem(buttonIconClassName)}
				onClick={loading ? undefined : handlePlayClick}
				className={bem(buttonClassName, loading && "loading")}
			/>
			{hidePreviousNext || (
				<Button
					transparent
					icon="skip_next"
					className={buttonClassName}
					iconClassName={buttonIconClassName}
					onClick={loading ? undefined : handleNextClick}
				/>
			)}
		</div>
	)
}

interface UserNextData {
	nextQueueSong: User,
}

interface UserPreviousData {
	previousQueueSong: User,
}

interface PropTypes {
	className?: BEMInput,
	buttonClassName?: BEMInput,
	hidePreviousNext?: boolean,
	buttonIconClassName?: BEMInput,
}

export default BarControls