import { createElement, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import ShuffleButton from "./shuffle"
import ObjectLink from "../../object-link"
import InLibraryButton from "./in-library"
import { Artist, Handler } from "../../../types"
import Modal, { ModalButtons, ModalHeader } from "../../modal"
import { createCatalogImageURL, createObjectPath } from "../../../helpers"

const ArtistModal: FC<PropTypes> = ({
	open,
	artist,
	onClose,
	hideInLibrary,
}) => (
	<Modal open={open} onClose={onClose}>
		<ModalHeader
			shareData={{
				title: artist.name,
				url: createObjectPath("artist", artist.artistID),
			}}
			image={{
				description: artist.name,
				src: createCatalogImageURL(
					artist.artistID,
					"profile",
					ImageSizes.MINI,
					ImageDimensions.SQUARE,
				),
			}}
			text={(
				<ObjectLink
					link={{
						text: artist.name,
						path: createObjectPath("artist", artist.artistID),
					}}
				/>
			)}
		/>
		<ModalButtons>
			{hideInLibrary || (
				<InLibraryButton
					artist={artist}
					onClose={onClose}
				/>
			)}
			<ShuffleButton
				onClose={onClose}
				artistID={artist.artistID}
			/>
		</ModalButtons>
	</Modal>
)

interface PropTypes {
	open: boolean,
	artist: Artist,
	onClose: Handler,
	hideInLibrary?: boolean,
}

export default ArtistModal