import { Pool } from "pg"
import algolia from "algoliasearch"
import { S3 } from "@aws-sdk/client-s3"
import { isUndefined } from "lodash-es"
import { IncomingHttpHeaders } from "http"
import { exists } from "@oly_op/pg-helpers"
import { createVerifier, TokenError } from "fast-jwt"
import { JWTPayload, ALGOLIA_OPTIONS, AWS_S3_OPTIONS } from "@oly_op/musicloud-common"

import { COLUMN_NAMES } from "../globals"
import { Context, ContextAuthorization } from "../types"
import { FastifyContext, ContextFunction } from "./apollo-server-fastify"

const verifyAccessToken =
	createVerifier({
		algorithms: [process.env.JWT_ALGORITHM],
		key: () => Promise.resolve(process.env.JWT_TOKEN_SECRET),
	})

type DetermineAuthorization =
	(pg: Pool, authorization: IncomingHttpHeaders["authorization"]) =>
	Promise<ContextAuthorization>

const determineAuthorization: DetermineAuthorization =
	async (pg, authorization) => {
		if (isUndefined(authorization)) {
			return undefined
		} else {
			if (authorization.startsWith("Bearer ")) {
				const accessToken =
					authorization.substring(7)
				try {
					const token =
						await verifyAccessToken(accessToken) as JWTPayload
					const userExists =
						await exists(pg)({
							table: "users",
							value: token.userID,
							column: COLUMN_NAMES.USER[0],
						})
					if (userExists) {
						return token
					} else {
						return undefined
					}
				} catch (error) {
					if (error instanceof TokenError) {
						return null
					} else {
						return undefined
					}
				}
			} else {
				return undefined
			}
		}
	}

const createContext =
	(): ContextFunction<FastifyContext, Context> => {
		const agClient =
			algolia(...ALGOLIA_OPTIONS)

		const agIndex =
			agClient.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME)

		const s3 =
			new S3(AWS_S3_OPTIONS)

		return async ({ request }) => ({
			s3,
			pg: request.server.pg.pool,
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