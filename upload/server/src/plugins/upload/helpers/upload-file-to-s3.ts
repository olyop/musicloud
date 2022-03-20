import { NAME } from "@oly_op/musicloud-common"
import { PutObjectCommand } from "@aws-sdk/client-s3"

import { s3 } from "../../../services"

export const uploadFileToS3 =
	(path: string, buffer: Buffer) =>
		s3.send(
			new PutObjectCommand({
				Key: path,
				Body: buffer,
				Bucket: NAME,
				ACL: "public-read",
			}),
		)