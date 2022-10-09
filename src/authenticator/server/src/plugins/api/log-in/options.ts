import { RouteShorthandOptions } from "fastify";

const options: RouteShorthandOptions = {
	schema: {
		body: {
			type: "object",
			properties: {
				password: { type: "string" },
				emailAddress: { type: "string" },
			},
			required: ["password", "emailAddress"],
		},
		response: {
			200: {
				type: "object",
				properties: {
					accessToken: { type: "string" },
				},
				required: ["accessToken"],
			},
		},
	},
};

export default options;
