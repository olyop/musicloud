import algolia from "algoliasearch"
import { GraphQLError } from "graphql"
import { S3 } from "@aws-sdk/client-s3"
import { isUndefined } from "lodash-es"
import { IncomingHttpHeaders } from "node:http"
import { RandomOrgClient } from "@randomorg/core"
import { createVerifier, TokenError } from "fast-jwt"
import { exists, PoolOrClient } from "@oly_op/pg-helpers"
import { ApolloServerErrorCode } from "@apollo/server/errors"
import { JWT_ALGORITHM } from "@oly_op/musicloud-common/build/globals"
import { ApolloFastifyContextFunction } from "@as-integrations/fastify"
import { JWTPayload, UserID } from "@oly_op/musicloud-common/build/types"
import { CustomServer } from "@oly_op/musicloud-common/build/create-fastify"
import { ALGOLIA_OPTIONS, AWS_S3_OPTIONS } from "@oly_op/musicloud-common/build/server-options"

import { COLUMN_NAMES } from "./globals"
import { ContextAuthorizationValidationProblem, Context, ContextAuthorization } from "./types"

const verifyAccessToken =
	createVerifier({
		algorithms: [JWT_ALGORITHM],
		key: () => Promise.resolve(process.env.JWT_TOKEN_SECRET),
	}) as (token: string) => Promise<JWTPayload>

const userExists =
	(pg: PoolOrClient) =>
		({ userID }: UserID) =>
			exists(pg)({
				value: userID,
				table: "users",
				column: COLUMN_NAMES.USER[0],
			})

const isTokenExpiredError =
	(error: unknown) =>
		error instanceof TokenError &&
		error.code === TokenError.codes.expired

type DetermineAuthorization =
	(pg: PoolOrClient, authorization: IncomingHttpHeaders["authorization"]) =>
	Promise<ContextAuthorization>

const determineAuthorization: DetermineAuthorization =
	async (pg, authorization) => {
		if (isUndefined(authorization)) {
			return ContextAuthorizationValidationProblem.UNAUTHORIZED
		} else {
			if (authorization.startsWith("Bearer ")) {
				try {
					const accessToken = authorization.substring(7)
					const token = await verifyAccessToken(accessToken)
					const doesUserExists = await userExists(pg)(token)
					if (doesUserExists) {
						return token
					} else {
						return ContextAuthorizationValidationProblem.UNAUTHORIZED
					}
				} catch (error) {
					if (isTokenExpiredError(error)) {
						return ContextAuthorizationValidationProblem.EXPIRED_TOKEN
					} else {
						return ContextAuthorizationValidationProblem.UNAUTHORIZED
					}
				}
			} else {
				return ContextAuthorizationValidationProblem.UNAUTHORIZED
			}
		}
	}

const createContext =
	(): ApolloFastifyContextFunction<Context, CustomServer> => {
		const s3 = new S3(AWS_S3_OPTIONS)
		const agClient = algolia(...ALGOLIA_OPTIONS)
		const randomDotOrg = new RandomOrgClient(process.env.RANDOM_ORG_API_KEY)
		const agIndex = agClient.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME)

		const getAuthorizationJWTPayload =
			(authorization: ContextAuthorization) => {
				if (typeof authorization === "string") {
					throw new GraphQLError("Not Authorized", {
						extensions: {
							code: ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED,
						},
					})
				} else {
					return authorization
				}
			}

		return async request => ({
			s3,
			randomDotOrg,
			pg: request.server.pg.pool,
			getAuthorizationJWTPayload,
			ag: {
				index: agIndex,
				client: agClient,
			},
			authorization: await determineAuthorization(
				request.server.pg.pool,
				request.headers.authorization,
			),
		})
	}

export default createContext