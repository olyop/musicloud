import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import { ImageInput } from "../../types"

const coverInputs: ImageInput[] = [{
	name: "cover",
	size: ImageSizes.MINI,
	dimension: ImageDimensions.SQUARE,
},{
	name: "cover",
	size: ImageSizes.HALF,
	dimension: ImageDimensions.SQUARE,
},{
	name: "cover",
	size: ImageSizes.FULL,
	dimension: ImageDimensions.SQUARE,
}]

export default coverInputs