import { createBEM } from "@oly_op/bem"
import { useAudioPosition } from "react-use-audio-player"
import { createElement, ChangeEventHandler, FC } from "react"

import { deserializeDuration } from "../../../helpers"
import { ClassNameBEMPropTypes } from "../../../types"

import "./index.scss"

const bem =
	createBEM("Progress")

const Progress: FC<PropTypes> = ({ ready, isNowPlaying, className }) => {
	const audioPosition = useAudioPosition()

	const handleSeek: HandleChange =
		event => {
			if (ready) {
				audioPosition.seek(parseInt(event.target.value))
			}
		}

	const position =
		isNowPlaying ?
			Math.floor(audioPosition.position) : 0

	const duration =
		isNowPlaying ?
			Math.floor(audioPosition.duration) : 0

	return (
		<div className={bem(className, "", "FlexRowGapHalf")}>
			<p
				className={bem("text", "ParagraphTwo")}
				children={deserializeDuration(position)}
			/>
			<input
				min={0}
				step={1}
				type="range"
				max={duration}
				value={position}
				onInput={handleSeek}
				className={bem("slider", "OverflowHidden")}
			/>
			<p
				className={bem("text", "ParagraphTwo")}
				children={deserializeDuration(duration)}
			/>
		</div>
	)
}

type HandleChange =
	ChangeEventHandler<HTMLInputElement>

interface PropTypes extends ClassNameBEMPropTypes {
	ready: boolean,
	isNowPlaying: boolean,
}

export default Progress