import { createElement, FC } from "react"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import PlayButton from "./play"
import NextButton from "./next"
import LaterButton from "./later"
import AfterButton from "./after"
import SongTitle from "../../song-title"
import InLibraryButton from "./in-library"
import { Handler, Song } from "../../../types"
import { createCatalogImageURL, createObjectPath } from "../../../helpers"
import Modal, { ModalButton, ModalButtons, ModalHeader, ModalOnClose } from "../../modal"

const SongModal: FC<PropTypes> = ({
	open,
	song,
	onClose,
	hidePlay,
	onRemove,
	hideInLibrary,
}) => (
	<Modal open={open} onClose={onClose}>
		<ModalHeader
			shareData={{
				title: song.title,
				url: createObjectPath("song", song.songID),
			}}
			text={(
				<SongTitle
					noLink
					song={song}
					onClick={onClose}
				/>
			)}
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
		<ModalButtons>
			{hidePlay || (
				<PlayButton
					song={song}
					onClose={onClose}
					hidePlay={hidePlay}
				/>
			)}
			<NextButton
				onClose={onClose}
				hidePlay={hidePlay}
				songID={song.songID}
			/>
			<AfterButton
				onClose={onClose}
				hidePlay={hidePlay}
				songID={song.songID}
			/>
			<LaterButton
				onClose={onClose}
				hidePlay={hidePlay}
				songID={song.songID}
			/>
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
			{hideInLibrary || (
				<InLibraryButton
					song={song}
					onClose={onClose}
				/>
			)}
			<ModalButton
				text="Playlist"
				onClose={onClose}
				icon="playlist_add"
				link={`/add-song-to-playlist/${removeDashesFromUUID(song.songID)}`}
			/>
			{onRemove && (
				<ModalButton
					text="Remove"
					onClose={onClose}
					icon="queue_music"
					onClick={onRemove}
				/>
			)}
		</ModalButtons>
	</Modal>
)

interface PropTypes extends ModalOnClose {
	song: Song,
	open: boolean,
	onRemove?: Handler,
	hidePlay?: boolean,
	hideInLibrary?: boolean,
}

export default SongModal