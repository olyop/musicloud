import {
	ImageInput,
	ImageSizes,
	ObjectID,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import sharp, { ResizeOptions } from "sharp"

import { uploadFileToS3 } from "./upload-file-to-s3"
import { determineS3ImagePath } from "./determine-s3-image-path"

interface BaseInput extends ObjectID {
	buffer: Buffer,
}

export interface UploadInput extends BaseInput {
	image: ImageInput,
}

export interface Input extends BaseInput {
	images: ImageInput[],
}

const determineImageDimesnions =
	(image: ImageInput): ResizeOptions => {
		const { size, dimension } = image
		if (size === ImageSizes.MINI) {
			return {
				height: 36,
				width: dimension === ImageDimensions.SQUARE ? 36 : 64,
			}
		} else if (size === ImageSizes.HALF) {
			return {
				height: 306,
				width: dimension === ImageDimensions.SQUARE ? 306 : 544,
			}
		} else {
			return {
				height: 1080,
				width: dimension === ImageDimensions.SQUARE ? 1080 : 1920,
			}
		}
	}

const uploadImageToS3 =
	({ objectID, buffer, image }: UploadInput) =>
		uploadFileToS3(determineS3ImagePath(objectID, image), buffer)

const resizeImage =
	(image: ImageInput, buffer: Buffer) =>
		sharp(buffer)
			.jpeg()
			.resize(determineImageDimesnions(image))
			.toBuffer()

export const normalizeImageAndUploadToS3 =
	async ({ objectID, buffer, images }: Input) => {
		for (const image of images) {
			await uploadImageToS3({
				image,
				objectID,
				buffer: await resizeImage(image, buffer),
			})
		}
	}