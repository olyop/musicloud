import algolia from "algoliasearch"
import { S3Client } from "@aws-sdk/client-s3"
import { ALGOLIA_OPTIONS } from "@oly_op/musicloud-common"

export const s3 =
	new S3Client({})

export const ag =
	algolia(...ALGOLIA_OPTIONS)
		.initIndex(process.env.ALGOLIA_INDEX_NAME)