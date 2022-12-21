import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NAME } from "@oly_op/musicloud-common/build/metadata";
import { QueryOptions, importSQL, query } from "@oly_op/pg-helpers";
import { removeDashesFromUUID } from "@oly_op/uuid-dashes";
import { FastifyPluginAsync } from "fastify";

import {
	emailAddressExists,
	getUserByEmailAddress,
	getUserPassword,
	isPasswordCorrect,
} from "../helpers";
import options from "./options";
import { Route } from "./types";

const isf = importSQL(import.meta.url);

const DELETE_LIBRARY_ARTISTS = await isf("delete-library-artists");
const DELETE_LIBRARY_PLAYLISTS = await isf("delete-library-playlists");
const DELETE_LIBRARY_SONGS = await isf("delete-library-songs");
const DELETE_USER_BY_ID = await isf("delete-by-id");
const DELETE_USER_PLAYLISTS = await isf("delete-playlists");

export const deleteAccount: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>("/delete-account", options, async request => {
			const { emailAddress, password } = request.body;

			const doesEmailAddressExists = await emailAddressExists(fastify.pg.pool)({ emailAddress });

			if (doesEmailAddressExists) {
				const user = await getUserByEmailAddress(fastify.pg.pool)({ emailAddress });

				const { userID } = user;

				const hashedPassword = await getUserPassword(fastify.pg.pool)({ userID });

				if (await isPasswordCorrect(password, hashedPassword)) {
					const client = await fastify.pg.pool.connect();

					try {
						await query(client)("BEGIN")();

						const queryOptions: QueryOptions<void> = { variables: { userID } };

						await query(client)(DELETE_LIBRARY_SONGS)(queryOptions);
						await query(client)(DELETE_LIBRARY_ARTISTS)(queryOptions);
						await query(client)(DELETE_LIBRARY_PLAYLISTS)(queryOptions);
						await query(client)(DELETE_USER_PLAYLISTS)(queryOptions);
						await query(client)(DELETE_USER_BY_ID)(queryOptions);

						await fastify.s3.send(
							new DeleteObjectCommand({
								Bucket: NAME,
								Key: `catalog/${removeDashesFromUUID(userID)}`,
							}),
						);

						await fastify.ag.index.deleteObject(userID);

						await query(client)("COMMIT")();

						return { success: true };
					} catch (error) {
						await query(client)("ROLLBACK")();

						throw new Error(
							`Error deleting records: ${error instanceof Error ? error.message : "unknown"}`,
						);
					}
				} else {
					throw new Error("Password is incorrect");
				}
			} else {
				throw new Error("Email Address does not exist");
			}
		});
	};
