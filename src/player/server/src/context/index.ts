import { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import { S3Client } from "@aws-sdk/client-s3";
import { CustomServer } from "@oly_op/musicloud-common/build/create-fastify";
import { JWTPayload } from "@oly_op/musicloud-common/build/types";
import { SearchClient, SearchIndex } from "algoliasearch";
import { Redis } from "ioredis";
import { Pool } from "pg";

import { agClient, agIndex, s3 } from "../services.js";
import { determineAuthorization } from "./determine-authorization.js";
import { getAuthorizationJWTPayload } from "./get-authorization-jwt-payload.js";
import { UnAuthorizedError } from "./unauthorized-error.js";

export const context: ApolloFastifyContextFunction<Context, CustomServer> = async request => ({
	s3,
	pg: request.server.pg.pool,
	redis: request.server.redis,
	ag: { client: agClient, index: agIndex },
	getAuthorizationJWTPayload,
	authorization: await determineAuthorization(
		request.headers.authorization,
		request.server.pg.pool,
	),
});

export interface ContextAlgolia {
	client: SearchClient;
	index: SearchIndex;
}

export type ContextAuthorization = JWTPayload | false;
export type ContextGetAuthorizationJWTPayload = (authorization: ContextAuthorization) => JWTPayload;

export interface Context {
	pg: Pool;
	s3: S3Client;
	redis: Redis;
	ag: ContextAlgolia;
	authorization: ContextAuthorization;
	getAuthorizationJWTPayload: ContextGetAuthorizationJWTPayload;
}

export { UnAuthorizedError };
