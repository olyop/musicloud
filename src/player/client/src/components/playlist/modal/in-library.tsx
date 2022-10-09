import { createElement, FC } from "react";

import { Playlist } from "../../../types";
import { ModalButton, ModalOnClose } from "../../modal";
import { useJWTPayload, useToggleObjectInLibrary } from "../../../hooks";

const InLibraryButton: FC<PropTypes> = ({ playlist, onClose }) => {
	const { userID } = useJWTPayload();

	const isOwnPlaylist = userID === playlist.user.userID;

	const [toggleInLibrary, inLibrary] = useToggleObjectInLibrary(playlist);

	return isOwnPlaylist ? null : (
		<ModalButton
			onClose={onClose}
			onClick={toggleInLibrary}
			icon={inLibrary ? "done" : "add"}
			text={inLibrary ? "Remove" : "Add"}
		/>
	);
};

interface PropTypes extends ModalOnClose {
	playlist: Playlist;
}

export default InLibraryButton;
