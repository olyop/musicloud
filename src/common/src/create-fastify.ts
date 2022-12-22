import { readFile } from "node:fs/promises";
import type http from "node:http";
import type http2 from "node:http2";

import Fastify, { FastifyInstance } from "fastify";
import type { FastifyHttp2SecureOptions, FastifyServerOptions } from "fastify";
import type { PrettyOptions } from "pino-pretty";

import { IS_DEVELOPMENT, USE_HTTPS } from "./globals";

const PINO_PRETTY_OPTIONS: PrettyOptions = {
	singleLine: true,
	translateTime: "HH:MM:ss Z",
	ignore: "pid,hostname,time,reqId,responseTime",
};

const createBaseOptions = <RawServer extends CustomServer>(): FastifyServerOptions<RawServer> => ({
	bodyLimit: 2e7,
	logger: IS_DEVELOPMENT
		? undefined
		: {
				transport: {
					target: "pino-pretty",
					options: PINO_PRETTY_OPTIONS,
				},
		  },
});

export const createFastify = async () => {
	if (USE_HTTPS) {
		const http2Options: FastifyHttp2SecureOptions<http2.Http2SecureServer> = {
			...createBaseOptions<http2.Http2SecureServer>(),
			http2: true,
			https: {
				allowHTTP1: true,
				cert: await readFile(process.env.TLS_CERTIFICATE_PATH),
				key: await readFile(process.env.TLS_CERTIFICATE_KEY_PATH),
			},
		};

		return Fastify(http2Options) as FastifyInstance<CustomServer>;
	} else {
		return Fastify(createBaseOptions<http.Server>()) as FastifyInstance<CustomServer>;
	}
};

export type CustomServer = http.Server | http2.Http2SecureServer;
