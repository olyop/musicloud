import { createElement, FC } from "react"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import PlayButton from "./play"
import ShuffleButton from "./shuffle"
import { Album } from "../../../types"
import InLibraryButton from "./in-library"
import AlbumTitle from "../../album-title"
import { createCatalogImageURL, createObjectPath } from "../../../helpers"
import Modal, { ModalButton, ModalButtons, ModalHeader, ModalOnClose } from "../../modal"

const AlbumModal: FC<PropTypes> = ({
	open,
	album,
	onClose,
	hideInLibrary,
}) => (
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
				link={`/add-album-to-playlist/${removeDashesFromUUID(album.albumID)}`}
			/>
			<ShuffleButton
				onClose={onClose}
				albumID={album.albumID}
			/>
		</ModalButtons>
	</Modal>
)

interface PropTypes extends ModalOnClose {
	album: Album,
	open: boolean,
	hideInLibrary?: boolean,
}

export default AlbumModal