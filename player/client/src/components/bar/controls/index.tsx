import Button from "@oly_op/react-button"
import { createBEM, BEMInput } from "@oly_op/bem"
import { useEffect, createElement, VFC } from "react"

import { togglePlay, useDispatch, useStatePlay } from "../../../redux"
import { useKeyPress, useNextQueueSong, usePreviousQueueSong } from "../../../hooks"

import "./index.scss"

const bem =
	createBEM("BarControls")

const BarControlsPlayButton: VFC<PlayButtonPropTypes> = ({
	ready,
	loading,
	buttonClassName,
	buttonIconClassName,
	playButtonClassName,
	playButtonIconClassName,
}) => {
	const play = useStatePlay()
	const dispatch = useDispatch()
	const playPausePress = useKeyPress("MediaPlayPause")

	const showLoop =
		loading || !ready

	const icon =
		showLoop ?
			"loop" : (
				play ?
					"pause" :
					"play_arrow"
			)

	const handleClick =
		() => {
			if (!showLoop) {
				dispatch(togglePlay())
			}
		}

	useEffect(() => {
		if (playPausePress) {
			dispatch(togglePlay())
		}
	}, [playPausePress])

	return (
		<Button
			icon={icon}
			onClick={handleClick}
			className={bem(playButtonClassName, buttonClassName)}
			iconClassName={bem(playButtonIconClassName, buttonIconClassName, showLoop && "loading")}
		/>
	)
}

const BarControls: VFC<PropTypes> = ({
	ready,
	className,
	buttonClassName,
	buttonIconClassName,
	playButtonClassName,
	playButtonIconClassName,
}) => {
	const [ nextQueueSong, nextData ] =
		useNextQueueSong()

	const [ previousQueueSong, previousData ] =
		usePreviousQueueSong()

	const handleNextQueueSong =
		() => { void nextQueueSong() }

	const handlePreviousQueueSong =
		() => { void previousQueueSong() }

	return (
		<div className={bem(className, "")}>
			<Button
				transparent
				icon="skip_previous"
				className={buttonClassName}
				onClick={handlePreviousQueueSong}
				iconClassName={buttonIconClassName}
			/>
			<BarControlsPlayButton
				ready={ready}
				buttonClassName={buttonClassName}
				buttonIconClassName={buttonIconClassName}
				playButtonClassName={playButtonClassName}
				playButtonIconClassName={playButtonIconClassName}
				loading={nextData.loading || previousData.loading}
			/>
			<Button
				transparent
				icon="skip_next"
				onClick={handleNextQueueSong}
				className={buttonClassName}
				iconClassName={buttonIconClassName}
			/>
		</div>
	)
}

interface PropTypesBase {
	ready: boolean,
	buttonClassName?: BEMInput,
	buttonIconClassName?: BEMInput,
	playButtonClassName?: BEMInput,
	playButtonIconClassName?: BEMInput,
}

interface PlayButtonPropTypes extends PropTypesBase {
	loading: boolean,
}

interface PropTypes extends PropTypesBase {
	className?: BEMInput,
}

export default BarControls