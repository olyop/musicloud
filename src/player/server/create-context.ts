import { Pool } from "pg"
import algolia from "algoliasearch"
import { S3 } from "@aws-sdk/client-s3"
import { FastifyRequest } from "fastify"
import { isString, isUndefined } from "lodash"
import jwt, { TokenExpiredError } from "jsonwebtoken"

import { Context, JWTPayload } from "./types"
import { ALGOLIA_OPTIONS, PG_POOL_OPTIONS } from "./globals"

const determineAuthorization =
	(request: FastifyRequest) => {
		const { authorization } = request.headers
		if (isUndefined(authorization)) {
			return undefined
		} else {
			try {
				const accessToken = authorization.substring(7)
				const payload = jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET)
				if (isString(payload)) {
					return undefined
				} else if ("userID" in payload) {
					return payload as JWTPayload
				} else {
					return undefined
				}
			} catch (error) {
				if (error instanceof TokenExpiredError) {
					return null
				} else {
					return undefined
				}
			}
		}
	}

type ContextFunction =
	(input: { request: FastifyRequest }) => Context

const createContext =
	(): ContextFunction => {
		const s3 = new S3({})
		const pg = new Pool(PG_POOL_OPTIONS)
		const ag = algolia(...ALGOLIA_OPTIONS).initIndex("search")
		return ({ request }) => ({
			s3,
			pg,
			ag,
			authorization: determineAuthorization(request),
		})
	}

export default createContext