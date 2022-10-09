import { ArtistID, ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";

import { createCatalogImageURL } from "../../../../helpers";

const downloadArtistCover = async ({ artistID }: ArtistID) => {
	await fetch(createCatalogImageURL(artistID, "cover", ImageSizes.HALF, ImageDimensions.LANDSCAPE));
	await fetch(createCatalogImageURL(artistID, "cover", ImageSizes.FULL, ImageDimensions.LANDSCAPE));
};

const downloadArtistProfile = async ({ artistID }: ArtistID) => {
	await fetch(createCatalogImageURL(artistID, "profile", ImageSizes.MINI, ImageDimensions.SQUARE));
	await fetch(createCatalogImageURL(artistID, "profile", ImageSizes.HALF, ImageDimensions.SQUARE));
};

const downloadArtistImages = async ({ artistID }: ArtistID) => {
	await downloadArtistCover({ artistID });
	await downloadArtistProfile({ artistID });
};

export default downloadArtistImages;
