import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import { Artist } from "../../../../types"
import { createCatalogImageURL } from "../../../../helpers"

const downloadArtists =
	async (artists: Artist[]) => {
		for (const { artistID } of artists) {
			await fetch(createCatalogImageURL(
				artistID,
				"cover",
				ImageSizes.HALF,
				ImageDimensions.LANDSCAPE,
			))
			await fetch(createCatalogImageURL(
				artistID,
				"cover",
				ImageSizes.FULL,
				ImageDimensions.LANDSCAPE,
			))
			await fetch(createCatalogImageURL(
				artistID,
				"profile",
				ImageSizes.MINI,
				ImageDimensions.SQUARE,
			))
			await fetch(createCatalogImageURL(
				artistID,
				"profile",
				ImageSizes.HALF,
				ImageDimensions.SQUARE,
			))
		}
	}

export default downloadArtists