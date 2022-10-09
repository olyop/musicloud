import { FastifyPluginAsync } from "fastify";

import { check } from "./check";
import { upload } from "./upload";
import { audioMetadata } from "./audio-metadata";

export const api: FastifyPluginAsync = async fastify => {
	await fastify.register(audioMetadata);
	await fastify.register(check, { prefix: "/check" });
	await fastify.register(upload, { prefix: "/upload" });
};
