import {
	CORSConfiguration as CORSConfigurationType,
	CreateBucketCommand,
	PutBucketCorsCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { AWS_S3_OPTIONS } from "@oly_op/musicloud-common/build/server-options";

const Bucket = process.env.AWS_S3_BUCKET_NAME;

const CORSConfiguration: CORSConfigurationType = {
	CORSRules: [
		{
			ExposeHeaders: [],
			MaxAgeSeconds: 3000,
			AllowedHeaders: ["*"],
			AllowedMethods: ["GET"],
			AllowedOrigins: [
				"https://localhost:3000",
				"https://localhost:3001",
				"https://player.musicloud-app.com",
			],
		},
	],
};

const s3 = new S3Client(AWS_S3_OPTIONS);

console.log(
	await s3.send(
		new CreateBucketCommand({
			Bucket,
		}),
	),
);
console.log(
	await s3.send(
		new PutBucketCorsCommand({
			Bucket,
			CORSConfiguration,
		}),
	),
);
