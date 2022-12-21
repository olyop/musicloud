import { RouteShorthandOptions } from "fastify";

const options: RouteShorthandOptions = {
	schema: {
		body: {
			type: "object",
			properties: {
				emailAddress: { type: "string" },
				currentPassword: { type: "string" },
				newPassword: { type: "string" },
			},
			required: ["emailAddress", "currentPassword", "newPassword"],
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
