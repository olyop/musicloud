import { SongID } from "@oly_op/musicloud-common/build/types";
import { FC, createElement } from "react";

import { useMutation } from "../../../hooks";
import { ModalButton, ModalOnClose } from "../../modal";
import QUEUE_SONG_LATER from "./queue-song-later.gql";

const LaterButton: FC<PropTypes> = ({ songID, onClose }) => {
	const [later, { loading }] = useMutation<unknown, SongID>(QUEUE_SONG_LATER, {
		variables: { songID },
	});

	const handleClick = () => {
		if (!loading) {
			void later();
		}
	};

	return <ModalButton icon="queue" text="Later" onClose={onClose} onClick={handleClick} />;
};

interface PropTypes extends SongID, ModalOnClose {
	hidePlay?: boolean;
}

export default LaterButton;
