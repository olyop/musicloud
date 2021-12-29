import { Pool } from "pg"
import { S3Client } from "@aws-sdk/client-s3"
import { SearchIndex, SearchClient } from "algoliasearch"
import { JWTPayload } from "@oly_op/music-app-common/types"

export interface OrderBy {
	field: string,
	direction: string,
}

export interface ContextAlgolia {
	index: SearchIndex,
	client: SearchClient,
}

export interface Context {
	pg: Pool,
	s3: S3Client,
	ag: ContextAlgolia,
	authorization: JWTPayload | undefined | null,
}