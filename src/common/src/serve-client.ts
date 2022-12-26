import { createReadStream } from "node:fs";

import { FastifyPluginAsync } from "fastify";

const fileExists = (path: string) =>
	new Promise<boolean>(resolve => {
		const stream = createReadStream(path);
		stream.on("error", () => resolve(false));
		stream.on("open", () => {
			stream.destroy();
			resolve(true);
		});
	});

export const serveClient: FastifyPluginAsync<Options> = async (fastify, { indexPath }) => {
	const exists = await fileExists(indexPath);

	fastify.setNotFoundHandler((request, reply) => {
		if (exists) {
			const stream = createReadStream(indexPath);
			void reply.type("text/html").send(stream);
		} else {
			void reply.status(404);
			void reply.send("Not found");
		}
	});
};

interface Options {
	indexPath: string;
}
