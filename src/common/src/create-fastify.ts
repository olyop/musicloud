import type { Server } from "node:http"
import { readFile } from "node:fs/promises"
import type { PrettyOptions } from "pino-pretty"
import Fastify, { FastifyInstance } from "fastify"
import type { Http2SecureServer } from "node:http2"
import type { FastifyHttp2SecureOptions, FastifyServerOptions } from "fastify"

import { IS_DEVELOPMENT, USE_HTTPS } from "./globals"

const PINO_PRETTY_OPTIONS: PrettyOptions = {
	singleLine: true,
	translateTime: "HH:MM:ss Z",
	ignore: "pid,hostname,time,reqId,responseTime",
}

const createBaseOptions =
	<RawServer extends Server | Http2SecureServer>(): FastifyServerOptions<RawServer> => ({
		bodyLimit: 2e+7,
		logger: IS_DEVELOPMENT ? undefined : {
			transport: {
				target: "pino-pretty",
				options: PINO_PRETTY_OPTIONS,
			},
		},
	})

export const createFastify =
	async () => {
		if (USE_HTTPS) {
			const http2Options: FastifyHttp2SecureOptions<Http2SecureServer> = {
				...createBaseOptions<Http2SecureServer>(),
				http2: true,
				https: {
					allowHTTP1: true,
					cert: await readFile(process.env.TLS_CERTIFICATE_PATH),
					key: await readFile(process.env.TLS_CERTIFICATE_KEY_PATH),
				},
			}

			return Fastify(http2Options) as FastifyInstance<Server | Http2SecureServer>
		} else {
			return Fastify(createBaseOptions<Server>()) as FastifyInstance<Server | Http2SecureServer>
		}
	}