import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

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
	<h2 className="HeadingFive FlexRowGapQuart">
		<Image
			title={artist.name}
			className={bem("", "Elevated")}
			url={createCatalogImageURL(
				artist.artistID,
				"profile",
				ImageSizes.MINI,
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