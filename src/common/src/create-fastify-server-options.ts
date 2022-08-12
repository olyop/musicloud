import ms from "ms"
import type { PrettyOptions } from "pino-pretty"
import type { FastifyHttp2SecureOptions } from "fastify"
import type { Http2SecureServer, SecureServerOptions } from "node:http2"

import { IS_DEVELOPMENT } from "./globals"

const PINO_PRETTY_OPTIONS: PrettyOptions = {
	singleLine: true,
	translateTime: "HH:MM:ss Z",
	ignore: "pid,hostname,time,reqId,responseTime",
}

export const createFastifyServerOptions =
	(https: Pick<SecureServerOptions, "cert" | "key">, options?: FastifyHttp2SecureOptions<Http2SecureServer>): FastifyHttp2SecureOptions<Http2SecureServer> => ({
		http2: true,
		bodyLimit: 2e+7,
		connectionTimeout: ms("120s"),
		http2SessionTimeout: ms("120s"),
		https: {
			...https,
			allowHTTP1: true,
		},
		logger: IS_DEVELOPMENT ? undefined : {
			transport: {
				target: "pino-pretty",
				options: PINO_PRETTY_OPTIONS,
			},
		},
		...options,
	})