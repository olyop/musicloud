import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import {
	createObjectPath,
	createCatalogImageURL,
} from "../../../helpers"

import { Artist } from "../../../types"
import ObjectLink from "../../../components/object-link"

import "./index.scss"

const bem =
	createBEM("AlbumArtist")

const AlbumArtist: VFC<PropTypes> = ({ artist }) => (
	<h2 className={bem("", "HeadingFive FlexRow")}>
		<img
			alt={artist.name}
			crossOrigin="anonymous"
			className={bem("profile", "Elevated")}
			src={createCatalogImageURL(
				artist.artistID,
				"profile",
				ImageSizes.HALF,
				ImageDimensions.SQUARE,
			)}
		/>
		<ObjectLink
			className={bem("link")}
			link={{
				text: artist.name,
				path: createObjectPath(
					"artist",
					artist.artistID,
				),
			}}
		/>
	</h2>
)

interface PropTypes {
	artist: Artist,
}

export default AlbumArtist