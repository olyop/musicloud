import Button from "@oly_op/react-button"
import { createBEM, BEMInput } from "@oly_op/bem"
import { createElement, FC, useEffect } from "react"

import { togglePlay, useDispatch, useStatePlay } from "../../../redux"
import { useKeyPress, useNextQueueSong, usePreviousQueueSong } from "../../../hooks"

import "./index.scss"

const bem =
	createBEM("BarControls")

const BarControls: FC<PropTypes> = ({
	className,
	buttonClassName,
	buttonIconClassName,
	playButtonClassName,
	playButtonIconClassName,
	hidePreviousNext = false,
}) => {
	const play = useStatePlay()
	const dispatch = useDispatch()
	const playPausePress = useKeyPress("MediaPlayPause")

	const [ nextQueueSong, { loading: nextLoading } ] =
		useNextQueueSong()

	const [ previousQueueSong, { loading: previousLoading } ] =
		usePreviousQueueSong()

	const loading =
		nextLoading || previousLoading

	const handlePlayClick =
		() => {
			dispatch(togglePlay())
		}

	const playButtonIcon =
		loading ?
			"loop" : (
				play ?
					"pause" :
					"play_arrow"
			)

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
					onClick={previousQueueSong}
					className={buttonClassName}
					iconClassName={buttonIconClassName}
				/>
			)}
			<Button
				icon={playButtonIcon}
				onClick={loading ? undefined : handlePlayClick}
				iconClassName={bem(playButtonIconClassName, buttonIconClassName)}
				className={bem(playButtonClassName, buttonClassName, loading && "loading")}
			/>
			{hidePreviousNext || (
				<Button
					transparent
					icon="skip_next"
					onClick={nextQueueSong}
					className={buttonClassName}
					iconClassName={buttonIconClassName}
				/>
			)}
		</div>
	)
}

interface PropTypes {
	className?: BEMInput,
	buttonClassName?: BEMInput,
	hidePreviousNext?: boolean,
	buttonIconClassName?: BEMInput,
	playButtonClassName?: BEMInput,
	playButtonIconClassName?: BEMInput,
}

export default BarControls