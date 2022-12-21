import { FastifyPluginAsync } from "fastify";

import { changePassword } from "./change-password";
import { checkEmailAddressExists } from "./check-email-address-exists";
import { deleteAccount } from "./delete-account";
import { logIn } from "./log-in";
import { signUp } from "./sign-up";

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
