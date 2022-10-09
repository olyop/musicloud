import fp from "fastify-plugin";
import fastifyJWT from "@fastify/jwt";
import { FastifyPluginAsync, RouteHandler } from "fastify";

import { FASTIFY_JWT_OPTIONS } from "../options";

export const jwt: FastifyPluginAsync = fp(async fastify => {
	await fastify.register(fastifyJWT, FASTIFY_JWT_OPTIONS);
	fastify.decorate<RouteHandler>("authenticate", async request => {
		await request.jwtVerify();
	});
});
