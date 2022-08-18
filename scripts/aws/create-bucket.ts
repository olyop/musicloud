import { NAME as Bucket } from "@oly_op/musicloud-common/build/metadata"
import { CreateBucketCommand, PutBucketCorsCommand, S3Client, CORSConfiguration as CORSConfigurationType } from "@aws-sdk/client-s3"

const CORSConfiguration: CORSConfigurationType = {
	CORSRules: [{
		AllowedHeaders: [
			"*",
		],
		AllowedMethods: [
			"GET",
		],
		AllowedOrigins: [
			"http://localhost:3000",
			"http://localhost:3001",
			"https://localhost:3000",
			"https://localhost:3001",
			"http://192.168.1.9:3001",
			"https://musicloud-app.com",
		],
		ExposeHeaders: [],
		MaxAgeSeconds: 3000,
	}],
}

const s3Client =
	new S3Client({})

console.log(
	await s3Client.send(
		new CreateBucketCommand({
			Bucket,
		}),
	),
)
console.log(
	await s3Client.send(
		new PutBucketCorsCommand({
			Bucket,
			CORSConfiguration,
		}),
	),
)