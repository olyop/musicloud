import { FC, createElement } from "react";

import { useToggleObjectInLibrary } from "../../../hooks";
import { Artist, Handler } from "../../../types";
import { ModalButton } from "../../modal";

const InLibraryButton: FC<PropTypes> = ({ artist, onClose }) => {
	const [toggleInLibrary, inLibrary] = useToggleObjectInLibrary(artist);
	return (
		<ModalButton
			onClose={onClose}
			onClick={toggleInLibrary}
			icon={inLibrary ? "done" : "add"}
			text={inLibrary ? "Remove" : "Add"}
		/>
	);
};

interface PropTypes {
	artist: Artist;
	onClose: Handler;
}

export default InLibraryButton;
