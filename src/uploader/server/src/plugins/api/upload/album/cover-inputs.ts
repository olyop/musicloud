import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";

import { ImageInput } from "../../types.js";

const coverInputs: ImageInput[] = [
	{
		name: "cover",
		size: ImageSizes.MINI,
		dimension: ImageDimensions.SQUARE,
	},
	{
		name: "cover",
		size: ImageSizes.HALF,
		dimension: ImageDimensions.SQUARE,
	},
	{
		name: "cover",
		size: ImageSizes.FULL,
		dimension: ImageDimensions.SQUARE,
	},
];

export default coverInputs;
