import { createBEM } from "@oly_op/bem"
import { useEffect, createElement, ChangeEventHandler, VFC } from "react"

import {
	useDispatch,
	useStatePlay,
	updateCurrent,
	useStateCurrent,
} from "../../../redux"

import { deserializeDuration } from "../../../helpers"
import { ClassNameBEMPropTypes } from "../../../types"

import "./index.scss"

const bem =
	createBEM("Progress")

const Progress: VFC<ProgressPropTypes> = ({
	duration,
	className,
}) => {
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
		<div className={bem(className, "", "FlexRowGapHalf")}>
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
				className={bem("slider", "OverflowHidden")}
			/>
			<p
				className={bem("text", "BodyTwo")}
				children={deserializeDuration(duration)}
			/>
		</div>
	)
}

type HandleChange =
	ChangeEventHandler<HTMLInputElement>

interface ProgressPropTypes extends ClassNameBEMPropTypes {
	duration: number,
}

export default Progress