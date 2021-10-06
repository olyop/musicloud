import { createBEM, BEMPropTypes } from "@oly_op/bem"
import { useEffect, createElement, ChangeEventHandler, FC } from "react"
import deserializeDuration from "@oly_op/music-app-common/deserialize-duration"

import {
	useDispatch,
	useStatePlay,
	updateCurrent,
	useStateCurrent,
} from "../../redux"

import "./index.scss"

const bem =
	createBEM("Progress")

const Progress: FC<PropTypes> = ({ duration, className }) => {
	const play = useStatePlay()
	const dispatch = useDispatch()
	const current = useStateCurrent()

	const handleChange: HandleChange =
		event => {
			if (!play) {
				dispatch(updateCurrent(parseInt(event.target.value)))
			}
		}

	useEffect(() => {
		const interval = setInterval(() => {
			if (play) {
				dispatch(updateCurrent(current + 1))
			}
		}, 1000)
		return () => clearInterval(interval)
	}, [play, current])

	return (
		<div className={bem(className, "", "FlexListGapHalf")}>
			<p
				className={bem("text", "BodyTwo")}
				children={deserializeDuration(current)}
			/>
			<input
				min={0}
				step={1}
				type="range"
				max={duration}
				value={current}
				onInput={handleChange}
				className={bem("slider")}
			/>
			<p
				className={bem("text", "BodyTwo")}
				children={deserializeDuration(duration)}
			/>
		</div>
	)
}

type HandleChange = ChangeEventHandler<HTMLInputElement>

interface PropTypes extends BEMPropTypes {
	duration: number,
}

export default Progress