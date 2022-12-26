import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const uploadFileToS3 = (s3: S3Client) => (path: string, buffer: Buffer) =>
	s3.send(
		new PutObjectCommand({
			Key: path,
			Body: buffer,
			ACL: "public-read",
			Bucket: process.env.AWS_S3_BUCKET_NAME,
		}),
	);
