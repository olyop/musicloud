import Button from "@oly_op/react-button";
import { FC, createElement } from "react";

import { useStatePlay } from "../../redux";
import { OnClickPropTypes } from "../../types";

const PlayButton: FC<PropTypes> = ({ isPlaying, onClick, className }) => {
	const play = useStatePlay();
	return (
		<Button
			transparent
			title="Play"
			onClick={onClick}
			className={className}
			icon={isPlaying && play ? "pause" : "play_arrow"}
		/>
	);
};

interface PropTypes extends OnClickPropTypes {
	isPlaying: boolean;
	className?: string;
}

export default PlayButton;
