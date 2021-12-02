import { Pool } from "pg"
import { JwtPayload } from "jsonwebtoken"
import { SearchIndex } from "algoliasearch"
import { S3Client } from "@aws-sdk/client-s3"
import { UserID } from "@oly_op/music-app-common/types"

export interface OrderBy {
	field: string,
	direction: string,
}

export interface Context {
	pg: Pool,
	s3: S3Client,
	ag: SearchIndex,
	authorization: JWTPayload | undefined | null,
}

export interface JWTPayload
	extends UserID, JwtPayload {}