import { NAME as Bucket } from "@oly_op/musicloud-common/build/metadata";
import {
	CreateBucketCommand,
	PutBucketCorsCommand,
	S3Client,
	CORSConfiguration as CORSConfigurationType,
} from "@aws-sdk/client-s3";

const CORSConfiguration: CORSConfigurationType = {
	CORSRules: [
		{
			AllowedHeaders: ["*"],
			AllowedMethods: ["GET"],
			AllowedOrigins: [
				"http://localhost:3000",
				"http://localhost:3001",
				"https://localhost:3000",
				"https://localhost:3001",
				"https://player.musicloud-app.com",
				"https://uploader.musicloud-app.com",
				"https://authenticator.musicloud-app.com",
			],
			ExposeHeaders: [],
			MaxAgeSeconds: 3000,
		},
	],
};

const s3Client = new S3Client({});

console.log(
	await s3Client.send(
		new CreateBucketCommand({
			Bucket,
		}),
	),
);
console.log(
	await s3Client.send(
		new PutBucketCorsCommand({
			Bucket,
			CORSConfiguration,
		}),
	),
);
