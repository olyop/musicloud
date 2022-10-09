import fs from "fs";
import { FastifyPluginAsync } from "fastify";

export const INDEX_DOT_HTML_PATH = new URL("public/index.html", import.meta.url);

const serveClient: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.setNotFoundHandler((request, reply) => {
			const stream = fs.createReadStream(INDEX_DOT_HTML_PATH);
			void reply.type("text/html").send(stream);
		});
	};

export default serveClient;
