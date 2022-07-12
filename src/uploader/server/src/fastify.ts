import http from "node:http"
import https from "node:https"
import { readFile } from "node:fs/promises"
import { FASTIFY_SERVER_OPTIONS } from "@oly_op/musicloud-common"
import Fastify, { FastifyHttpsOptions, FastifyServerOptions } from "fastify"

const SERVER_OPTIONS: FastifyHttpsOptions<https.Server> | FastifyServerOptions =
	process.env.USE_HTTPS ? {
		...FASTIFY_SERVER_OPTIONS,
		https: {
			cert: await readFile(process.env.TLS_CERTIFICATE_PATH),
			key: await readFile(process.env.TLS_CERTIFICATE_KEY_PATH),
		},
	} : FASTIFY_SERVER_OPTIONS

const fastify =
	Fastify<http.Server | https.Server>(SERVER_OPTIONS)

export default fastify