import { FastifyPluginAsync } from "fastify";

import {
	createJWT,
	emailAddressExists,
	getUserByEmailAddress,
	getUserPassword,
	isPasswordCorrect,
} from "../helpers";
import options from "./options";
import { Route } from "./types";

export const logIn: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>("/log-in", options, async request => {
			const { password, emailAddress } = request.body;

			const doesEmailAddressExists = await emailAddressExists(fastify.pg.pool)({ emailAddress });

			if (doesEmailAddressExists) {
				const user = await getUserByEmailAddress(fastify.pg.pool)({ emailAddress });

				const { userID } = user;

				const hashedPassword = await getUserPassword(fastify.pg.pool)({ userID });

				if (await isPasswordCorrect(password, hashedPassword)) {
					return {
						accessToken: await createJWT(fastify.ag.client)(user),
					};
				} else {
					throw new Error("Password is incorrect");
				}
			} else {
				throw new Error("Email Address does not exist");
			}
		});
	};
