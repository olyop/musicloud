import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types"

export interface BodyEntry {
	data: Buffer,
	limit: false,
	filename: string,
	encoding: string,
	mimetype: string,
}

export interface ImageInput {
	name: string,
	size: ImageSizes,
	dimension: ImageDimensions,
}