import { Pool } from "pg";
import { RandomOrgClient } from "@randomorg/core";
import { S3Client } from "@aws-sdk/client-s3";
import { JWTPayload } from "@oly_op/musicloud-common/build/types";
import { SearchIndex, SearchClient } from "algoliasearch";

export interface OrderBy {
	field: string;
	direction: string;
}

export interface ContextAlgolia {
	index: SearchIndex;
	client: SearchClient;
}

export const enum ContextAuthorizationValidationProblem {
	EXPIRED_TOKEN = "EXPIRED",
	UNAUTHORIZED = "UNAUTHORIZED",
}

export type ContextAuthorization = JWTPayload | ContextAuthorizationValidationProblem;

export interface Context {
	pg: Pool;
	s3: S3Client;
	ag: ContextAlgolia;
	randomDotOrg: RandomOrgClient;
	authorization: ContextAuthorization;
	getAuthorizationJWTPayload: (authorization: ContextAuthorization) => JWTPayload;
}
