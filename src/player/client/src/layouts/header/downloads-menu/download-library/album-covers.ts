import { AlbumID, ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types"

import { createCatalogImageURL } from "../../../../helpers"

const downloadAlbumCovers =
	async ({ albumID }: AlbumID) => {
		await fetch(createCatalogImageURL(
			albumID,
			"cover",
			ImageSizes.MINI,
			ImageDimensions.SQUARE,
		))
		await fetch(createCatalogImageURL(
			albumID,
			"cover",
			ImageSizes.HALF,
			ImageDimensions.SQUARE,
		))
		await fetch(createCatalogImageURL(
			albumID,
			"cover",
			ImageSizes.FULL,
			ImageDimensions.SQUARE,
		))
	}

export default downloadAlbumCovers