import Button from "@oly_op/react-button";
import { FC, createElement } from "react";

import { createObjectPath } from "../../helpers";
import { useShare } from "../../hooks";
import { Album } from "../../types";

const ShareButton: FC<PropTypes> = ({ album }) => {
	const [share, { shareIcon, shareText }] = useShare();

	const handleShare = () => {
		void share({
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
