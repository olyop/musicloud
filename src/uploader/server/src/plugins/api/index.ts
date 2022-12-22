import { FastifyPluginAsync } from "fastify";

import { audioMetadata } from "./audio-metadata";
import { check } from "./check";
import { upload } from "./upload";

export const api: FastifyPluginAsync = async fastify => {
	await fastify.register(audioMetadata);
	await fastify.register(check, { prefix: "/check" });
	await fastify.register(upload, { prefix: "/upload" });
};
