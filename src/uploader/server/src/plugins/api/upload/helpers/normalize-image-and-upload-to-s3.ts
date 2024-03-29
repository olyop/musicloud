import { S3 } from "@aws-sdk/client-s3";
import { ImageDimensions, ImageSizes, ObjectID } from "@oly_op/musicloud-common/build/types";
import sharp, { ResizeOptions } from "sharp";

import { ImageInput } from "../../types.js";
import { determineCatalogImagePath } from "./determine-catalog-image-path.js";
import { uploadFileToS3 } from "./upload-file-to-s3.js";

interface BaseInput extends ObjectID {
	buffer: Buffer;
}

export interface UploadInput extends BaseInput {
	image: ImageInput;
}

export interface Input extends BaseInput {
	images: ImageInput[];
}

const determineDimensions = ({ size, dimension }: ImageInput): ResizeOptions => {
	if (size === ImageSizes.MINI) {
		return {
			height: 36,
			width: dimension === ImageDimensions.SQUARE ? 36 : 64,
		};
	} else if (size === ImageSizes.HALF) {
		return {
			height: 306,
			width: dimension === ImageDimensions.SQUARE ? 306 : 544,
		};
	} else {
		return {
			height: 1080,
			width: dimension === ImageDimensions.SQUARE ? 1080 : 1920,
		};
	}
};

const uploadToS3 =
	(s3: S3) =>
	({ objectID, buffer, image }: UploadInput) =>
		uploadFileToS3(s3)(determineCatalogImagePath(objectID, image), buffer);

const normalize = (image: ImageInput, buffer: Buffer) =>
	sharp(buffer).jpeg().resize(determineDimensions(image)).toBuffer();

export const normalizeImageAndUploadToS3 =
	(s3: S3) =>
	async ({ objectID, buffer, images }: Input) => {
		for (const image of images) {
			await uploadToS3(s3)({
				image,
				objectID,
				buffer: await normalize(image, buffer),
			});
		}
	};
