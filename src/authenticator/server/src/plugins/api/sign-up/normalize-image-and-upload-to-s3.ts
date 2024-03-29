import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ImageDimensions, ImageSizes, ObjectID } from "@oly_op/musicloud-common/build/types";
import sharp, { ResizeOptions } from "sharp";

import determineCatalogImagePath from "./determine-catalog-image-path.js";
import { ImageInput } from "./types.js";

interface BaseInput extends ObjectID {
	buffer: Buffer;
}

interface UploadInput extends BaseInput {
	image: ImageInput;
}

interface Input extends BaseInput {
	images: ImageInput[];
}

const determineImageDimensions = (image: ImageInput): ResizeOptions => {
	const { size, dimension } = image;
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

const uploadImageToS3 =
	(s3: S3Client) =>
	({ objectID, buffer, image }: UploadInput) =>
		s3.send(
			new PutObjectCommand({
				Body: buffer,
				ACL: "public-read",
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: determineCatalogImagePath(objectID, image),
			}),
		);

const resizeImage = (image: ImageInput, buffer: Buffer) =>
	sharp(buffer).jpeg().resize(determineImageDimensions(image)).toBuffer();

export const normalizeImageAndUploadToS3 =
	(s3: S3Client) =>
	async ({ objectID, images, buffer }: Input) => {
		for (const image of images) {
			await uploadImageToS3(s3)({
				image,
				objectID,
				buffer: await resizeImage(image, buffer),
			});
		}
	};
