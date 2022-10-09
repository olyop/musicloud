import { createElement, FC } from "react";

import { Song } from "../../../types";
import { ModalButton, ModalOnClose } from "../../modal";
import { useToggleObjectInLibrary } from "../../../hooks";

const InLibraryButton: FC<PropTypes> = ({ song, onClose }) => {
	const [toggleInLibrary, inLibrary] = useToggleObjectInLibrary(song);
	return (
		<ModalButton
			onClose={onClose}
			onClick={toggleInLibrary}
			icon={inLibrary ? "done" : "add"}
			text={inLibrary ? "Remove" : "Add"}
		/>
	);
};

interface PropTypes extends ModalOnClose {
	song: Song;
}

export default InLibraryButton;
