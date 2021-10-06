import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import {
	determineObjectPath,
	determineCatalogImageURL,
} from "../../../helpers"

import { Artist } from "../../../types"
import ObjectLink from "../../../components/object-link"

import "./index.scss"

const bem =
	createBEM("AlbumArtist")

const AlbumArtist: FC<PropTypes> = ({ artist }) => (
	<h2 className="HeadingFive FlexListGapQuart">
		<Image
			title={artist.name}
			className={bem("", "Elevated")}
			url={determineCatalogImageURL(
				artist.artistID,
				"profile",
				ImageSizes.MINI,
				ImageDimensions.SQUARE,
			)}
		/>
		<ObjectLink
			text={artist.name}
			className={bem("link")}
			path={determineObjectPath("artist", artist.artistID)}
		/>
	</h2>
)

interface PropTypes {
	artist: Artist,
}

export default AlbumArtist