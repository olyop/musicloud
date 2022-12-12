import { UserEmailAddressBase } from "@oly_op/musicloud-common/build/types";
import { exists } from "@oly_op/pg-helpers";
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface Reply {
	exists: boolean;
}

interface Route {
	Body: UserEmailAddressBase;
	Reply: Reply;
}

const options: RouteShorthandOptions = {
	schema: {
		body: {
			type: "object",
			properties: {
				emailAddress: { type: "string" },
			},
			required: ["emailAddress"],
		},
		response: {
			200: {
				type: "object",
				properties: {
					exists: { type: "boolean" },
				},
				required: ["exists"],
			},
		},
	},
};

export const checkEmailAddressExists: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>("/check-email-address-exists", options, async request => {
			const { emailAddress } = request.body;

			let emailAddressExists;

			try {
				emailAddressExists = await exists(fastify.pg.pool)({
					table: "users",
					value: emailAddress,
					column: "email_address",
				});
			} catch (error) {
				console.error(error);
				emailAddressExists = false;
			}

			return {
				exists: emailAddressExists,
			};
		});
	};
