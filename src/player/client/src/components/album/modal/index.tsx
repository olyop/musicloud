import { createElement, FC, useEffect, useState } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types"

import PlayButton from "./play"
import ShuffleButton from "./shuffle"
import { Album } from "../../../types"
import InLibraryButton from "./in-library"
import AlbumTitle from "../../album-title"
import { createCatalogImageURL, createObjectPath } from "../../../helpers"
import Modal, { ModalButton, ModalButtons, ModalHeader, ModalOnClose } from "../../modal"
import AddAlbumToPlaylist from "../../add-album-to-playlist"

const AlbumModal: FC<PropTypes> = ({
	open,
	album,
	onClose,
	hideInLibrary,
}) => {
	const [ addToPlaylist, setAddToPlayPlaylist ] =
		useState(false)

	const handleAddToPlaylistOpen =
		() => setAddToPlayPlaylist(true)

	const handleAddToPlaylistClose =
		() => {
			setAddToPlayPlaylist(false)
		}

	useEffect(() => () => {
		if (addToPlaylist) {
			setAddToPlayPlaylist(false)
		}
	})

	return (
		<Modal open={open} onClose={onClose}>
			<ModalHeader
				shareData={{
					title: album.title,
					url: createObjectPath("album", album.albumID),
				}}
				text={(
					<AlbumTitle
						hideReleased
						album={album}
					/>
				)}
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
				<AddAlbumToPlaylist
					albumID={album.albumID}
					onClose={handleAddToPlaylistClose}
				/>
			) : (
				<ModalButtons>
					<PlayButton
						onClose={onClose}
						albumID={album.albumID}
					/>
					{hideInLibrary || (
						<InLibraryButton
							onClose={onClose}
							albumID={album.albumID}
						/>
					)}
					<ModalButton
						text="Playlist"
						icon="playlist_add"
						onClose={handleAddToPlaylistOpen}
					/>
					<ShuffleButton
						onClose={onClose}
						albumID={album.albumID}
					/>
				</ModalButtons>
			)}
		</Modal>
	)
}

interface PropTypes extends ModalOnClose {
	album: Album,
	open: boolean,
	hideInLibrary?: boolean,
}

export default AlbumModal