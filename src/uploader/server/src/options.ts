import { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyMultipartOptions } from "@fastify/multipart";
import { JWTPayload } from "@oly_op/musicloud-common/build/types";
import { exists } from "@oly_op/pg-helpers";
import bytes from "bytes";

export const FASTIFY_JWT_OPTIONS: FastifyJWTOptions = {
	secret: process.env.JWT_TOKEN_SECRET,
	trusted: async (request, accessToken) => {
		const { userID } = accessToken as JWTPayload;

		const userExists = await exists(request.server.pg.pool)({
			value: userID,
			table: "users",
			column: "user_id",
		});

		if (userExists) {
			const adminUsers = JSON.parse(process.env.ADMIN_USER_IDS) as string[];
			return adminUsers.includes(userID);
		} else {
			return false;
		}
	},
};

export const FASTIFY_MULTIPART_OPTIONS: FastifyMultipartOptions = {
	addToBody: true,
	throwFileSizeLimit: false,
	limits: {
		fileSize: bytes("50mb"),
	},
};
