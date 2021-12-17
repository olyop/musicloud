import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

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