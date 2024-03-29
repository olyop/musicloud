import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import { FC, createElement, useEffect, useState } from "react";

import { createCatalogImageURL, createObjectPath } from "../../../helpers";
import { Handler, Song } from "../../../types";
import AddToPlaylist from "../../add-song-to-playlist";
import Modal, { ModalButton, ModalButtons, ModalHeader, ModalOnClose } from "../../modal";
import SongTitle from "../../song-title";
import AfterButton from "./after";
import InLibraryButton from "./in-library";
import LaterButton from "./later";
import NextButton from "./next";
import PlayButton from "./play";

const SongModal: FC<PropTypes> = ({ open, song, onClose, hidePlay, onRemove, hideInLibrary }) => {
	const [addToPlaylist, setAddToPlayPlaylist] = useState(false);

	const handleAddToPlaylistOpen = () => setAddToPlayPlaylist(true);

	const handleAddToPlaylistClose = () => {
		setAddToPlayPlaylist(false);
		onClose();
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
					title: song.title,
					url: createObjectPath("song", song.songID),
				}}
				text={<SongTitle song={song} onClick={onClose} />}
				image={{
					description: song.title,
					src: createCatalogImageURL(
						song.album.albumID,
						"cover",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					),
				}}
			/>
			{addToPlaylist ? (
				<AddToPlaylist songID={song.songID} onClose={handleAddToPlaylistClose} />
			) : (
				<ModalButtons>
					{hidePlay || <PlayButton song={song} onClose={onClose} hidePlay={hidePlay} />}
					<NextButton onClose={onClose} hidePlay={hidePlay} songID={song.songID} />
					<AfterButton onClose={onClose} hidePlay={hidePlay} songID={song.songID} />
					<LaterButton onClose={onClose} hidePlay={hidePlay} songID={song.songID} />
					<ModalButton
						icon="album"
						text="Album"
						onClose={onClose}
						link={createObjectPath("album", song.album.albumID)}
					/>
					<ModalButton
						icon="person"
						text="Artist"
						onClose={onClose}
						link={createObjectPath("artist", song.artists[0]!.artistID)}
					/>
					{hideInLibrary || <InLibraryButton song={song} onClose={onClose} />}
					<ModalButton text="Playlist" icon="playlist_add" onClose={handleAddToPlaylistOpen} />
					{onRemove && (
						<ModalButton text="Remove" onClose={onClose} icon="queue_music" onClick={onRemove} />
					)}
				</ModalButtons>
			)}
		</Modal>
	);
};

interface PropTypes extends ModalOnClose {
	song: Song;
	open: boolean;
	onRemove?: Handler;
	hidePlay?: boolean;
	hideInLibrary?: boolean;
}

export default SongModal;
