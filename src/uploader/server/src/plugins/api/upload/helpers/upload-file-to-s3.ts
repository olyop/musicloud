import { NAME } from "@oly_op/musicloud-common/build/metadata"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

export const uploadFileToS3 =
	(s3: S3Client) =>
		(path: string, buffer: Buffer) =>
			s3.send(
				new PutObjectCommand({
					Key: path,
					Body: buffer,
					Bucket: NAME,
					ACL: "public-read",
				}),
			)