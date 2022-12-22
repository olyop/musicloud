import { FC, createElement } from "react";

import { useToggleObjectInLibrary } from "../../../hooks";
import { Song } from "../../../types";
import { ModalButton, ModalOnClose } from "../../modal";

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
