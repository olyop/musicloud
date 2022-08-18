import { FastifyJWTOptions } from "@fastify/jwt"
import { FastifyListenOptions } from "fastify"
import { FastifyStaticOptions } from "@fastify/static"
import { FastifyMultipartOptions } from "@fastify/multipart"
import { FASTIFY_STATIC_OPTIONS as FASTIFY_STATIC_BASE_OPTIONS } from "@oly_op/musicloud-common/build/server-options"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_JWT_OPTIONS: FastifyJWTOptions = {
	secret: process.env.JWT_TOKEN_SECRET,
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
	root: PUBLIC_PATH,
}

export const FASTIFY_LISTEN_OPTIONS: FastifyListenOptions = {
	host: process.env.HOST,
	port: parseInt(process.env.UPLOADER_SERVER_PORT),
}