import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import { FC, createElement, useEffect, useState } from "react";

import { createCatalogImageURL, createObjectPath } from "../../../helpers";
import { Album } from "../../../types";
import AddAlbumToPlaylist from "../../add-album-to-playlist";
import AlbumTitle from "../../album-title";
import Modal, { ModalButton, ModalButtons, ModalHeader, ModalOnClose } from "../../modal";
import InLibraryButton from "./in-library";
import PlayButton from "./play";
import ShuffleButton from "./shuffle";

const AlbumModal: FC<PropTypes> = ({ open, album, onClose, hideInLibrary }) => {
	const [addToPlaylist, setAddToPlayPlaylist] = useState(false);

	const handleAddToPlaylistOpen = () => setAddToPlayPlaylist(true);

	const handleAddToPlaylistClose = () => {
		setAddToPlayPlaylist(false);
	};

	useEffect(() => () => {
		if (addToPlaylist) {
			setAddToPlayPlaylist(false);
		}
	});

	return (
		<Modal open={open} onClose={onClose}>
			<ModalHeader
				shareData={{
					title: album.title,
					url: createObjectPath("album", album.albumID),
				}}
				text={<AlbumTitle hideReleased album={album} />}
				image={{
					description: album.title,
					src: createCatalogImageURL(
						album.albumID,
						"cover",
						ImageSizes.MINI,
						ImageDimensions.SQUARE,
					),
				}}
			/>
			{addToPlaylist ? (
				<AddAlbumToPlaylist albumID={album.albumID} onClose={handleAddToPlaylistClose} />
			) : (
				<ModalButtons>
					<PlayButton onClose={onClose} albumID={album.albumID} />
					{hideInLibrary || <InLibraryButton onClose={onClose} albumID={album.albumID} />}
					<ModalButton text="Playlist" icon="playlist_add" onClose={handleAddToPlaylistOpen} />
					<ShuffleButton onClose={onClose} albumID={album.albumID} />
				</ModalButtons>
			)}
		</Modal>
	);
};

interface PropTypes extends ModalOnClose {
	album: Album;
	open: boolean;
	hideInLibrary?: boolean;
}

export default AlbumModal;
