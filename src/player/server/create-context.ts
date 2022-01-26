import { Pool } from "pg"
import algolia from "algoliasearch"
import { S3 } from "@aws-sdk/client-s3"
import { isUndefined } from "lodash-es"
import { FastifyRequest } from "fastify"
import { IncomingHttpHeaders } from "http"
import { exists } from "@oly_op/pg-helpers"
import { createVerifier, TokenError } from "fast-jwt"
import { JWTPayload } from "@oly_op/music-app-common/types"
import { ALGOLIA_OPTIONS } from "@oly_op/music-app-common/options"

import { Context } from "./types"
import { COLUMN_NAMES } from "./globals"

type ContextFunction =
	(input: { request: FastifyRequest }) => Promise<Context>

const verifyAccessToken =
	createVerifier({ key: process.env.JWT_TOKEN_SECRET })

const determineAuthorization =
	async (pg: Pool, authorization: IncomingHttpHeaders["authorization"]) => {
		try {
			if (isUndefined(authorization)) {
				return undefined
			} else {
				if (authorization.startsWith("Bearer ")) {
					const accessToken =
						authorization.substring(7)
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
						return null
					}
				} else {
					return null
				}
			}
		} catch (error) {
			if (error instanceof TokenError) {
				return null
			} else {
				return undefined
			}
		}
	}

const createContext =
	(): ContextFunction => {
		const s3 = new S3({})
		const ag = algolia(...ALGOLIA_OPTIONS)
		const agIndex = ag.initIndex(process.env.ALGOLIA_INDEX_NAME)
		return async ({ request }) => ({
			s3,
			pg: request.server.pg.pool,
			ag: {
				client: ag,
				index: agIndex,
			},
			authorization: await determineAuthorization(
				request.server.pg.pool,
				request.headers.authorization,
			),
		})
	}

export default createContext