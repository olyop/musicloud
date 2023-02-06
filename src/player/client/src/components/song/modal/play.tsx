import { FC, createElement } from "react";

import { usePlaySong } from "../../../hooks";
import { useStatePlay } from "../../../redux";
import { Song } from "../../../types";
import { ModalButton, ModalOnClose } from "../../modal";

const PlayButton: FC<PropTypes> = ({ song, onClose }) => {
	const play = useStatePlay();
	const [playSong, isPlaying] = usePlaySong(song);
	const playing = play && isPlaying;
	return (
		<ModalButton
			onClose={onClose}
			onClick={playSong}
			text={playing ? "Pause" : "Play"}
			icon={playing ? "pause" : "play_arrow"}
		/>
	);
};

const PlayButtonWrapper: FC<WrapperPropTypes> = ({ hidePlay, ...propTypes }) => {
	if (hidePlay) {
		return null;
	}

	return <PlayButton {...propTypes} />;
};

interface PropTypes extends ModalOnClose {
	song: Song;
}

interface WrapperPropTypes extends PropTypes {
	hidePlay?: boolean;
}

export default PlayButtonWrapper;
