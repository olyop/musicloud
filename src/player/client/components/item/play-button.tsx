import Button from "@oly_op/react-button"
import { createElement, FC } from "react"

import { OnClickPropTypes } from "../../types"

const PlayButton: FC<PropTypes> = ({ isPlaying, onClick, className }) => (
	<Button
		transparent
		title="Play"
		onClick={onClick}
		className={className}
		icon={isPlaying ? "pause" : "play_arrow"}
	/>
)

interface PropTypes extends OnClickPropTypes {
	isPlaying: boolean,
	className?: string,
}

export default PlayButton