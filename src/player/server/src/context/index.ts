import { IncomingHttpHeaders } from "node:http";

import { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import { S3Client } from "@aws-sdk/client-s3";
import { CustomServer } from "@oly_op/musicloud-common/build/create-fastify";
import { IS_PRODUCTION } from "@oly_op/musicloud-common/build/globals";
import { ALGOLIA_OPTIONS, AWS_S3_OPTIONS } from "@oly_op/musicloud-common/build/server-options";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { JWTPayload } from "@oly_op/musicloud-common/build/types";
import { exists } from "@oly_op/pg-helpers";
import {
	RedisClusterOptions,
	RedisClusterType,
	RedisFunctions,
	RedisModules,
	RedisScripts,
	createCluster,
} from "@redis/client";
import algoliasearch, { AlgoliaSearchOptions, SearchClient, SearchIndex } from "algoliasearch";
import { isUndefined } from "lodash-es";
import ms from "ms";
import { Pool } from "pg";

import { UnauthorizedError } from "./unauthorized-error.js";
import { verifyAccessToken } from "./verify-access-token.js";

const algolia = algoliasearch as unknown as (
	appId: string,
	apiKey: string,
	options?: AlgoliaSearchOptions,
) => SearchClient;

export type RedisClient = RedisClusterType<RedisModules, RedisFunctions, RedisScripts>;

export interface ContextAlgolia {
	client: SearchClient;
	index: SearchIndex;
}

export type ContextAuthorization = JWTPayload | false;
export type ContextGetAuthorizationJWTPayload = (authorization: ContextAuthorization) => JWTPayload;

export interface Context {
	pg: Pool;
	s3: S3Client;
	ag: ContextAlgolia;
	redis: RedisClient;
	authorization: ContextAuthorization;
	getAuthorizationJWTPayload: ContextGetAuthorizationJWTPayload;
}

const determineAuthorization = async (
	authorization: IncomingHttpHeaders["authorization"],
	pool: Pool,
): Promise<ContextAuthorization> => {
	if (isUndefined(authorization)) {
		return false;
	} else {
		if (authorization.startsWith("Bearer ")) {
			try {
				const token = await verifyAccessToken(authorization.slice(7));

				const userExists = IS_PRODUCTION
					? await exists(pool)({
							table: "users",
							value: token.userID,
							column: COLUMN_NAMES.USER[0],
					  })
					: true;

				if (userExists) {
					return token;
				} else {
					return false;
				}
			} catch {
				return false;
			}
		} else {
			return false;
		}
	}
};

const getAuthorizationJWTPayload: ContextGetAuthorizationJWTPayload = authorization => {
	if (authorization === false) {
		throw new UnauthorizedError();
	} else {
		return authorization;
	}
};

const REDIS_OPTIONS: RedisClusterOptions = {
	rootNodes: [
		{
			url: `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`,
			username: process.env.REDIS_USERNAME,
			password: process.env.REDIS_PASSWORD,
			socket: {
				connectTimeout: ms("1s"),
				tls: false,
			},
		},
	],
};

export const createContext = async (): Promise<
	ApolloFastifyContextFunction<Context, CustomServer>
> => {
	const s3 = new S3Client(AWS_S3_OPTIONS);

	const agClient = algolia(...ALGOLIA_OPTIONS);
	const agIndex = agClient.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME);
	const ag: ContextAlgolia = { client: agClient, index: agIndex };

	const redis = createCluster(REDIS_OPTIONS);
	await redis.connect();

	return async request => ({
		s3,
		ag,
		redis,
		pg: request.server.pg.pool,
		getAuthorizationJWTPayload,
		authorization: await determineAuthorization(
			request.headers.authorization,
			request.server.pg.pool,
		),
	});
};

export { UnauthorizedError };
