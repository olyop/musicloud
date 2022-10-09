import Button from "@oly_op/react-button";
import { createElement, FC } from "react";

import { Artist } from "../../types";
import { useToggleObjectInLibrary } from "../../hooks";

const ArtistFollowButton: FC<ArtistFollowButtonPropTypes> = ({ artist }) => {
	const [toggleInLibrary, inLibrary, isError] = useToggleObjectInLibrary(artist);
	return (
		<Button
			onClick={toggleInLibrary}
			text={inLibrary ? "Following" : "Follow"}
			icon={isError ? "warning" : inLibrary ? "library_add_check" : "library_add"}
		/>
	);
};

interface ArtistFollowButtonPropTypes {
	artist: Artist;
}

export default ArtistFollowButton;
