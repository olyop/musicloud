import { NAME } from "@oly_op/musicloud-common"
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3"

export const uploadFileToS3 =
	(s3: S3) =>
		(path: string, buffer: Buffer) =>
			s3.send(
				new PutObjectCommand({
					Key: path,
					Body: buffer,
					Bucket: NAME,
					ACL: "public-read",
				}),
			)