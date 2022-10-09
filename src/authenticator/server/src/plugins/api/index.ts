import { FastifyPluginAsync } from "fastify";

import { logIn } from "./log-in";
import { signUp } from "./sign-up";
import { checkEmailAddressExists } from "./check-email-address-exists";

export const api: FastifyPluginAsync = async fastify => {
	await fastify.register(
		async instance => {
			await instance.register(logIn);
			await instance.register(signUp);
			await instance.register(checkEmailAddressExists);
		},
		{
			prefix: "/api",
		},
	);
};
