import { RouteShorthandOptions } from "fastify"

const options: RouteShorthandOptions = {
	schema: {
		body: {
			type: "object",
			properties: {
				name:
					{ type: "string" },
				cover:
					{ type: "string" },
				profile:
					{ type: "string" },
				password:
					{ type: "string" },
				emailAddress:
					{ type: "string" },
			},
			required: [
				"name",
				"cover",
				"profile",
				"password",
				"emailAddress",
			],
		},
		response: {
			200: {
				type: "object",
				properties: {
					accessToken:
						{ type: "string" },
				},
				required: [
					"accessToken",
				],
			},
		},
	},
}

export default options