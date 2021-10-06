import algolia from "algoliasearch"
import { S3Client } from "@aws-sdk/client-s3"

import { ALGOLIA_OPTIONS } from "./globals"

export const s3 =
	new S3Client({})

export const ag =
	algolia(...ALGOLIA_OPTIONS).initIndex("search")