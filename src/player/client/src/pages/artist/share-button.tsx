import Button from "@oly_op/react-button";
import { FC, createElement } from "react";

import { createObjectPath } from "../../helpers";
import { useShare } from "../../hooks";
import { Artist } from "../../types";

const ShareButton: FC<PropTypes> = ({ artist, width }) => {
	const [share, { shareIcon, shareText }] = useShare();

	const handleShare = () => {
		void share({
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
