import { AlbumID } from "@oly_op/musicloud-common/build/types";
import { FC, createElement } from "react";

import { usePlayAlbum } from "../../../hooks";
import { useStatePlay } from "../../../redux";
import { ModalButton, ModalOnClose } from "../../modal";

const PlayButton: FC<PropTypes> = ({ albumID, onClose }) => {
	const play = useStatePlay();

	const [playAlbum, isPlaying] = usePlayAlbum({ albumID });

	const playing = play && isPlaying;

	return (
		<ModalButton
			onClose={onClose}
			onClick={playAlbum}
			text={playing ? "Pause" : "Play"}
			icon={playing ? "pause" : "play_arrow"}
		/>
	);
};

interface PropTypes extends ModalOnClose, AlbumID {}

export default PlayButton;
