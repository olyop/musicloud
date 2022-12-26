import { FastifyPluginAsync } from "fastify";

import { changePassword } from "./change-password/index.js";
import { checkEmailAddressExists } from "./check-email-address-exists/index.js";
import { deleteAccount } from "./delete-account/index.js";
import { logIn } from "./log-in/index.js";
import { signUp } from "./sign-up/index.js";

export const api: FastifyPluginAsync = async fastify => {
	await fastify.register(
		async instance => {
			await instance.register(changePassword);
			await instance.register(checkEmailAddressExists);
			await instance.register(deleteAccount);
			await instance.register(logIn);
			await instance.register(signUp);
		},
		{
			prefix: "/api",
		},
	);
};
