import { RouteShorthandOptions } from "fastify";

const options: RouteShorthandOptions = {
	schema: {
		body: {
			type: "object",
			properties: {
				password: { type: "string" },
				emailAddress: { type: "string" },
			},
			required: ["emailAddress", "password"],
		},
		response: {
			200: {
				type: "object",
				properties: {
					success: { type: "boolean" },
				},
				required: ["success"],
			},
		},
	},
};

export default options;
