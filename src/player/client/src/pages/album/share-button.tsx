import Button from "@oly_op/react-button";
import { createElement, FC } from "react";

import { Album } from "../../types";
import { useShare } from "../../hooks";
import { createObjectPath } from "../../helpers";

const ShareButton: FC<PropTypes> = ({ album }) => {
	const [share, { shareIcon, shareText }] = useShare();

	const handleShare = () => {
		share({
			title: album.title,
			url: createObjectPath("album", album.albumID),
		});
	};

	return <Button icon={shareIcon} text={shareText} onClick={handleShare} />;
};

interface PropTypes {
	album: Pick<Album, "albumID" | "title">;
}

export default ShareButton;
