import { Pool } from "pg"
import { S3Client } from "@aws-sdk/client-s3"
import { JWTPayload } from "@oly_op/musicloud-common"
import { SearchIndex, SearchClient } from "algoliasearch"

export interface OrderBy {
	field: string,
	direction: string,
}

export interface ContextAlgolia {
	index: SearchIndex,
	client: SearchClient,
}

export type ContextAuthorization =
	JWTPayload | undefined | null

export interface Context {
	pg: Pool,
	s3: S3Client,
	ag: ContextAlgolia,
	authorization: ContextAuthorization,
}