import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";

import { ImageInput } from "./types.js";

export const coverImages: ImageInput[] = [
	{
		name: "cover",
		size: ImageSizes.HALF,
		dimension: ImageDimensions.LANDSCAPE,
	},
	{
		name: "cover",
		size: ImageSizes.FULL,
		dimension: ImageDimensions.LANDSCAPE,
	},
];

export const profileImages: ImageInput[] = [
	{
		name: "profile",
		size: ImageSizes.MINI,
		dimension: ImageDimensions.SQUARE,
	},
	{
		name: "profile",
		size: ImageSizes.HALF,
		dimension: ImageDimensions.SQUARE,
	},
	{
		name: "profile",
		size: ImageSizes.FULL,
		dimension: ImageDimensions.SQUARE,
	},
];
