import { exists } from "@oly_op/pg-helpers"
import { FastifyListenOptions } from "fastify"
import { FastifyJWTOptions } from "@fastify/jwt"
import { FastifyStaticOptions } from "@fastify/static"
import { FastifyMultipartOptions } from "@fastify/multipart"
import { JWTPayload } from "@oly_op/musicloud-common/build/types"
import { FASTIFY_STATIC_OPTIONS as FASTIFY_STATIC_BASE_OPTIONS } from "@oly_op/musicloud-common/build/server-options"

export const FASTIFY_JWT_OPTIONS: FastifyJWTOptions = {
	secret: process.env.JWT_TOKEN_SECRET,
	trusted: async (request, accessToken) => {
		const { userID } = accessToken as JWTPayload

		const userExists =
			await exists(request.server.pg.pool)({
				value: userID,
				table: "users",
				column: "user_id",
			})

		if (userExists) {
			const adminUsers = JSON.parse(process.env.JWT_TOKEN_ADMIN_USERS) as string[]
			return adminUsers.includes(userID)
		} else {
			return false
		}
	},
}

export const FASTIFY_MULTIPART_OPTIONS: FastifyMultipartOptions = {
	addToBody: true,
	throwFileSizeLimit: false,
	limits: {
		fileSize: 30000000,
	},
}

export const FASTIFY_STATIC_OPTIONS: FastifyStaticOptions = {
	...FASTIFY_STATIC_BASE_OPTIONS,
	root: new URL("public", import.meta.url).pathname,
}

export const FASTIFY_LISTEN_OPTIONS: FastifyListenOptions = {
	host: process.env.HOST,
	port: parseInt(process.env.UPLOADER_SERVER_PORT),
}