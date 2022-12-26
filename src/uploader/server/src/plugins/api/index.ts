import { FastifyPluginAsync } from "fastify";

import { audioMetadata } from "./audio-metadata.js";
import { check } from "./check/index.js";
import { upload } from "./upload/index.js";

export const api: FastifyPluginAsync = async fastify => {
	await fastify.register(audioMetadata);
	await fastify.register(check, { prefix: "/check" });
	await fastify.register(upload, { prefix: "/upload" });
};
