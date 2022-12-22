import { PlaylistID } from "@oly_op/musicloud-common/build/types";
import { FC, createElement } from "react";

import { usePlayPlaylist } from "../../../hooks";
import { useStatePlay } from "../../../redux";
import { Handler } from "../../../types";
import { ModalButton, ModalOnClose } from "../../modal";

const PlayButton: FC<PropTypes> = ({ playlistID, onClose }) => {
	const play = useStatePlay();

	const [playPlaylist, isPlaying] = usePlayPlaylist({ playlistID });

	const playing = play && isPlaying;

	return (
		<ModalButton
			onClose={onClose}
			onClick={playPlaylist}
			text={playing ? "Pause" : "Play"}
			icon={playing ? "pause" : "play_arrow"}
		/>
	);
};

interface PropTypes extends PlaylistID, ModalOnClose {
	onClose: Handler;
}

export default PlayButton;
