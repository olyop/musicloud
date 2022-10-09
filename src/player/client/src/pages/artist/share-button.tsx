import Button from "@oly_op/react-button";
import { createElement, FC } from "react";

import { Artist } from "../../types";
import { useShare } from "../../hooks";
import { createObjectPath } from "../../helpers";

const ShareButton: FC<PropTypes> = ({ artist, width }) => {
	const [share, { shareIcon, shareText }] = useShare();

	const handleShare = () => {
		share({
			title: artist.name,
			url: createObjectPath("artist", artist.artistID),
		});
	};

	return (
		<Button icon={shareIcon} onClick={handleShare} text={width > 700 ? shareText : undefined} />
	);
};

interface PropTypes {
	width: number;
	artist: Pick<Artist, "artistID" | "name">;
}

export default ShareButton;
