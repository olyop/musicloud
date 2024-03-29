import { createBEM } from "@oly_op/bem";
import { ChangeEventHandler, FC, createElement } from "react";
import { useAudioPosition } from "react-use-audio-player";

import { deserializeDuration } from "../../../helpers";
import { ClassNameBEMPropTypes } from "../../../types";
import { BarCommonPropTypes } from "../types";
import "./index.scss";

const bem = createBEM("Progress");

const Progress: FC<PropTypes> = ({ audio, nowPlaying, className }) => {
	const audioPosition = useAudioPosition();

	const allowControls = nowPlaying && !audio.loading && !audio.error;

	const handleSeek: HandleChange = event => {
		if (allowControls) {
			audioPosition.seek(Number.parseInt(event.target.value));
		}
	};

	const position = allowControls ? Math.floor(audioPosition.position) : 0;

	const duration = allowControls ? Math.floor(audioPosition.duration) : 0;

	return (
		<div className={bem(className, "", "FlexRowGapHalf")}>
			<p className={bem("text", "ParagraphTwo")} children={deserializeDuration(position)} />
			<input
				min={0}
				step={1}
				type="range"
				max={duration}
				value={position}
				onChange={handleSeek}
				className={bem("slider", "OverflowHidden")}
			/>
			<p className={bem("text", "ParagraphTwo")} children={deserializeDuration(duration)} />
		</div>
	);
};

type HandleChange = ChangeEventHandler<HTMLInputElement>;

interface PropTypes extends BarCommonPropTypes, ClassNameBEMPropTypes {}

export default Progress;
