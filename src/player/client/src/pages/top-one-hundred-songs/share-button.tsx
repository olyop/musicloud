import Button from "@oly_op/react-button";
import { FC, createElement } from "react";

import { useShare } from "../../hooks";

const ShareButton: FC = () => {
	const [share, { shareIcon, shareText }] = useShare();

	const handleShare = () => {
		void share({
			title: "Top #100",
			url: "/top-one-hundred-songs",
		});
	};
	return (
		<Button transparent icon={shareIcon} onClick={handleShare} text={shareText || undefined} />
	);
};

export default ShareButton;
