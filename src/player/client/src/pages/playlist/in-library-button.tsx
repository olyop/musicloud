import Button from "@oly_op/react-button";
import { FC, createElement } from "react";

import { useToggleObjectInLibrary } from "../../hooks";
import { Playlist } from "../../types";

const PlaylistPageInLibraryButton: FC<PropTypes> = ({ playlist }) => {
	const [toggleInLibrary, inLibrary] = useToggleObjectInLibrary(playlist);
	return (
		<Button
			onClick={toggleInLibrary}
			icon={inLibrary ? "done" : "add"}
			text={inLibrary ? "Remove" : "Add"}
		/>
	);
};

interface PropTypes {
	playlist: Playlist;
}

export default PlaylistPageInLibraryButton;
