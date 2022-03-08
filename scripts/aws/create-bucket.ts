import { NAME as Bucket } from "@oly_op/musicloud-common"
import { CreateBucketCommand, PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3"

const s3Client =
	new S3Client({})

const main =
	async () => {
		try {
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
						CORSConfiguration: {
							CORSRules: [{
								ExposeHeaders: [],
								AllowedHeaders: [],
								AllowedOrigins: ["*"],
								AllowedMethods: ["GET"],
							}],
						},
					}),
				),
			)
		} catch (error) {
			console.error(error)
		}
	}

void main()