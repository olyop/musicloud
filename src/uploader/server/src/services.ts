import algolia from "algoliasearch"
import { S3Client } from "@aws-sdk/client-s3"
import { ALGOLIA_OPTIONS } from "@oly_op/musicloud-common"

export const s3 =
	new S3Client({})

export const agClient =
	algolia(...ALGOLIA_OPTIONS)

export const agIndex =
	agClient.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME)