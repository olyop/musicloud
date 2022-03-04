import Button from "@oly_op/react-button"
import { createBEM, BEMInput } from "@oly_op/bem"
import { useEffect, createElement, VFC } from "react"

import { togglePlay, useDispatch, useStatePlay } from "../../../redux"
import { useKeyPress, useNextQueueSong, usePreviousQueueSong } from "../../../hooks"

import "./index.scss"

const bem =
	createBEM("BarControls")

const BarControlsPlayButton: VFC<ButtonPropTypes> = ({
	loading,
	buttonClassName,
	buttonIconClassName,
	playButtonClassName,
	playButtonIconClassName,
}) => {
	const play = useStatePlay()
	const dispatch = useDispatch()
	const playPausePress = useKeyPress("MediaPlayPause")

	const icon =
		loading ?
			"loop" : (
				play ?
					"pause" :
					"play_arrow"
			)

	const handleClick =
		() => {
			dispatch(togglePlay())
		}

	useEffect(() => {
		if (playPausePress) {
			dispatch(togglePlay())
		}
	}, [playPausePress])

	return (
		<Button
			icon={icon}
			onClick={loading ? undefined : handleClick}
			iconClassName={bem(playButtonIconClassName, buttonIconClassName)}
			className={bem(playButtonClassName, buttonClassName, loading && "loading")}
		/>
	)
}

const BarControls: VFC<PropTypes> = ({
	className,
	buttonClassName,
	buttonIconClassName,
	playButtonClassName,
	playButtonIconClassName,
}) => {
	const [ nextQueueSong, { loading: nextLoading } ] =
		useNextQueueSong()

	const [ previousQueueSong, { loading: previousLoading } ] =
		usePreviousQueueSong()

	const loading =
		nextLoading || previousLoading

	return (
		<div className={bem(className, "")}>
			<Button
				transparent
				icon="skip_previous"
				onClick={previousQueueSong}
				className={buttonClassName}
				iconClassName={buttonIconClassName}
			/>
			<BarControlsPlayButton
				loading={loading}
				buttonClassName={buttonClassName}
				buttonIconClassName={buttonIconClassName}
				playButtonClassName={playButtonClassName}
				playButtonIconClassName={playButtonIconClassName}
			/>
			<Button
				transparent
				icon="skip_next"
				onClick={nextQueueSong}
				className={buttonClassName}
				iconClassName={buttonIconClassName}
			/>
		</div>
	)
}

interface PropTypesBase {
	buttonClassName?: BEMInput,
	buttonIconClassName?: BEMInput,
	playButtonClassName?: BEMInput,
	playButtonIconClassName?: BEMInput,
}

interface ButtonPropTypes extends PropTypesBase {
	loading: boolean,
}

interface PropTypes extends PropTypesBase {
	className?: BEMInput,
}

export default BarControls