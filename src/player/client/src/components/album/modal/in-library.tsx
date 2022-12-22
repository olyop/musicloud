import { AlbumID } from "@oly_op/musicloud-common/build/types";
import { FC, createElement } from "react";

import { useToggleAlbumInLibrary } from "../../../hooks";
import { ModalButton, ModalOnClose } from "../../modal";

const InLibraryButton: FC<PropTypes> = ({ albumID, onClose }) => {
	const [toggleInLibrary, inLibrary] = useToggleAlbumInLibrary({ albumID });
	return (
		<ModalButton
			onClose={onClose}
			onClick={toggleInLibrary}
			icon={inLibrary ? "done" : "add"}
			text={inLibrary ? "Remove" : "Add"}
		/>
	);
};

interface PropTypes extends AlbumID, ModalOnClose {}

export default InLibraryButton;
