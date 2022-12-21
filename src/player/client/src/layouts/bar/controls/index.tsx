import { BEMInput, createBEM } from "@oly_op/bem";
import "@oly_op/css-utilities/index.css";
import Button from "@oly_op/react-button";
// eslint-disable-next-line import/extensions, import/no-unresolved
import "@oly_op/react-button/index.css";
import { FC, createElement } from "react";

import { useNextQueueSong, usePreviousQueueSong } from "../../../hooks";
import "../../../index.scss";
import { togglePlay, useDispatch, useStatePlay } from "../../../redux";
import { ClassNameBEMPropTypes } from "../../../types";
import { BarCommonPropTypes } from "../types";
import "./index.scss";

const bem = createBEM("BarControls");

const PlayButton: FC<PlayButtonPropTypes> = ({
	audio,
	nowPlaying,
	buttonClassName,
	buttonIconClassName,
	playButtonClassName,
	playButtonIconClassName,
}) => {
	const play = useStatePlay();
	const dispatch = useDispatch();

	const showLoop = nowPlaying ? (play ? audio.stopped && audio.loading : false) : false;

	const icon = audio.error
		? "error_outline"
		: showLoop
		? "loop"
		: nowPlaying
		? play
			? "pause"
			: "play_arrow"
		: "play_arrow";

	const handleTogglePlay = () => {
		if (nowPlaying) {
			dispatch(togglePlay());
		}
	};

	return (
		<Button
			icon={icon}
			onClick={handleTogglePlay}
			className={bem(playButtonClassName, buttonClassName)}
			iconClassName={bem(playButtonIconClassName, buttonIconClassName, showLoop && "loading")}
		/>
	);
};

const BarControls: FC<PropTypes> = ({
	audio,
	className,
	nowPlaying,
	buttonClassName,
	buttonIconClassName,
	playButtonClassName,
	playButtonIconClassName,
}) => {
	const [nextQueueSong, { loading: nextQueueSongLoading }] = useNextQueueSong();

	const [previousQueueSong, { loading: previousQueueSongLoading }] = usePreviousQueueSong();

	const loading = nextQueueSongLoading || previousQueueSongLoading;

	const handleNextQueueSong = () => {
		if (!loading) {
			void nextQueueSong();
		}
	};

	const handlePreviousQueueSong = () => {
		if (!previousQueueSongLoading) {
			void previousQueueSong();
		}
	};

	return (
		<div className={bem(className, "")}>
			<Button
				transparent
				icon="skip_previous"
				className={buttonClassName}
				onClick={handlePreviousQueueSong}
				iconClassName={buttonIconClassName}
			/>
			<PlayButton
				audio={audio}
				nowPlaying={nowPlaying}
				buttonClassName={buttonClassName}
				buttonIconClassName={buttonIconClassName}
				playButtonClassName={playButtonClassName}
				playButtonIconClassName={playButtonIconClassName}
			/>
			<Button
				transparent
				icon="skip_next"
				onClick={handleNextQueueSong}
				className={buttonClassName}
				iconClassName={buttonIconClassName}
			/>
		</div>
	);
};

interface ClassNamePropTypes {
	buttonClassName?: BEMInput;
	buttonIconClassName?: BEMInput;
	playButtonClassName?: BEMInput;
	playButtonIconClassName?: BEMInput;
}

interface PlayButtonPropTypes extends BarCommonPropTypes, ClassNamePropTypes {}

interface PropTypes extends ClassNameBEMPropTypes, BarCommonPropTypes, ClassNamePropTypes {}

export default BarControls;
