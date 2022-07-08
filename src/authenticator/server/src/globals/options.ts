import { FastifyServerOptions } from "fastify"
import { FastifyStaticOptions } from "@fastify/static"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	bodyLimit: 2e+7,
}

export const SERVE_STATIC_OPTIONS: FastifyStaticOptions = {
	index: false,
	root: PUBLIC_PATH,
}