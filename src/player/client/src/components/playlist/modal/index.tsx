import { FC, createElement } from "react";

import { createObjectPath } from "../../../helpers";
import { Playlist } from "../../../types";
import Modal, { ModalButtons, ModalHeader, ModalOnClose } from "../../modal";
import ObjectLink from "../../object-link";
import InLibraryButton from "./in-library";
import PlayButton from "./play";
import ShuffleButton from "./shuffle";

const PlaylistModal: FC<ModalPropTypes> = ({ open, onClose, playlist, hideInLibrary }) => (
	<Modal open={open} onClose={onClose}>
		<ModalHeader
			icon="queue_music"
			shareData={{
				title: playlist.title,
				url: createObjectPath("playlist", playlist.playlistID),
			}}
			text={
				<ObjectLink
					link={{
						text: playlist.title,
						path: createObjectPath("playlist", playlist.playlistID),
					}}
				/>
			}
		/>
		<ModalButtons>
			<PlayButton onClose={onClose} playlistID={playlist.playlistID} />
			{hideInLibrary || <InLibraryButton onClose={onClose} playlist={playlist} />}
			<ShuffleButton onClose={onClose} playlistID={playlist.playlistID} />
		</ModalButtons>
	</Modal>
);

interface ModalPropTypes extends ModalOnClose {
	open: boolean;
	playlist: Playlist;
	hideInLibrary?: boolean;
}

export default PlaylistModal;
