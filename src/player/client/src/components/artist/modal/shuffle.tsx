import { ArtistID } from "@oly_op/musicloud-common/build/types";
import { FC, createElement } from "react";

import { useShuffleArtist } from "../../../hooks";
import { Handler } from "../../../types";
import { ModalButton } from "../../modal";

const ShuffleButton: FC<PropTypes> = ({ onClose, artistID }) => {
	const [shuffle] = useShuffleArtist({ artistID });
	return <ModalButton icon="shuffle" text="Shuffle" onClose={onClose} onClick={shuffle} />;
};

interface PropTypes extends ArtistID {
	onClose: Handler;
}

export default ShuffleButton;
