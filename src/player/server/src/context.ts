import { IncomingHttpHeaders } from "node:http";

import { ApolloServerErrorCode } from "@apollo/server/errors";
import { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import { S3Client } from "@aws-sdk/client-s3";
import { CustomServer } from "@oly_op/musicloud-common/build/create-fastify";
import { JWT_ALGORITHM } from "@oly_op/musicloud-common/build/globals";
import { ALGOLIA_OPTIONS, AWS_S3_OPTIONS } from "@oly_op/musicloud-common/build/server-options";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { JWTPayload } from "@oly_op/musicloud-common/build/types";
import { exists } from "@oly_op/pg-helpers/build";
import { RandomOrgClient } from "@randomorg/core";
import algolia, { SearchClient, SearchIndex } from "algoliasearch";
import { createVerifier } from "fast-jwt";
import { GraphQLError } from "graphql";
import { isUndefined } from "lodash-es";
import { Pool } from "pg";

interface ContextAlgolia {
	index: SearchIndex;
	client: SearchClient;
}

type ContextAuthorization = JWTPayload | false;

export interface Context {
	pg: Pool;
	s3: S3Client;
	ag: ContextAlgolia;
	randomDotOrg: RandomOrgClient;
	authorization: ContextAuthorization;
	getAuthorizationJWTPayload: (authorization: ContextAuthorization) => JWTPayload;
}

const verifyAccessToken = createVerifier({
	algorithms: [JWT_ALGORITHM],
	key: () => Promise.resolve(process.env.JWT_TOKEN_SECRET),
}) as (token: string) => Promise<JWTPayload>;

const determineAuthorization = async (
	authorization: IncomingHttpHeaders["authorization"],
	pg: Pool,
): Promise<ContextAuthorization> => {
	if (isUndefined(authorization)) {
		return false;
	} else {
		if (authorization.startsWith("Bearer ")) {
			try {
				const token = await verifyAccessToken(authorization.slice(7));

				const userExists = await exists(pg)({
					table: "users",
					value: token.userID,
					column: COLUMN_NAMES.USER[0],
				});

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

export const UNAUTHORIZED_ERROR = new GraphQLError("Unauthorized", {
	extensions: {
		code: ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED,
	},
});

const getAuthorizationJWTPayload = (authorization: ContextAuthorization) => {
	if (authorization === false) {
		throw UNAUTHORIZED_ERROR;
	} else {
		return authorization;
	}
};

const s3 = new S3Client(AWS_S3_OPTIONS);
const agClient = algolia(...ALGOLIA_OPTIONS);
const randomDotOrg = new RandomOrgClient(process.env.RANDOM_ORG_API_KEY);
const agIndex = agClient.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME);
const ag: ContextAlgolia = { client: agClient, index: agIndex };

export const contextFunction: ApolloFastifyContextFunction<
	Context,
	CustomServer
> = async request => ({
	s3,
	ag,
	randomDotOrg,
	pg: request.server.pg.pool,
	getAuthorizationJWTPayload,
	authorization: await determineAuthorization(
		request.headers.authorization,
		request.server.pg.pool,
	),
});
