import { AlgoliaRecordArtist, ArtistID } from "@oly_op/musicloud-common/build/types";
import { convertFirstRowToCamelCase, exists, query } from "@oly_op/pg-helpers";
import { FastifyPluginAsync } from "fastify";
import { trim } from "lodash-es";

import {
	addRecordToSearchIndex,
	deleteRecordFromSearchIndex,
	determineCatalogImageURL,
	normalizeImageAndUploadToS3,
} from "../helpers";
import { coverImageInputs, profileImageInputs } from "./images-inputs";
import { INSERT_ARTIST } from "./sql";
import { Route } from "./types";

export const uploadArtist: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>("/artist", { onRequest: fastify.authenticate }, async (request, reply) => {
			const { body } = request;

			const name = trim(body.name);
			const cover = body.cover[0]!.data;
			const profile = body.profile[0]!.data;
			const city = body.city ? trim(body.city) : null;
			const country = body.country ? trim(body.country) : null;

			const doesArtistAlreadyExist = await exists(fastify.pg.pool)({
				value: name,
				column: "name",
				table: "artists",
			});

			if (doesArtistAlreadyExist) {
				throw new Error("Artist already exists");
			}

			console.log(`Start Artist Upload: ${name}`);

			let artistID: string | null = null;
			const client = await fastify.pg.pool.connect();

			try {
				await client.query("BEGIN");

				const result = await query(client)(INSERT_ARTIST)({
					parse: convertFirstRowToCamelCase<ArtistID>(),
					variables: [
						{
							key: "name",
							value: name,
							parameterized: true,
						},
						...(city && country
							? [
									{
										key: "city",
										value: city,
										parameterized: true,
									},
									{
										key: "country",
										value: country,
										parameterized: true,
									},
							  ]
							: []),
					],
				});

				artistID = result.artistID;

				await normalizeImageAndUploadToS3(fastify.s3)({
					buffer: cover,
					objectID: artistID,
					images: coverImageInputs,
				});

				await normalizeImageAndUploadToS3(fastify.s3)({
					buffer: profile,
					objectID: artistID,
					images: profileImageInputs,
				});

				await addRecordToSearchIndex(fastify.ag.index)<AlgoliaRecordArtist>({
					name,
					plays: 0,
					typeName: "Artist",
					objectID: artistID,
					image: determineCatalogImageURL(artistID, profileImageInputs[2]!),
					...(city && country ? { city, country } : {}),
				});

				await client.query("COMMIT");

				console.log(`Finish Artist Upload: ${name}`);

				void reply.code(201);

				return { artistID };
			} catch (error) {
				await client.query("ROLLBACK");

				if (artistID) {
					await deleteRecordFromSearchIndex(fastify.ag.index)({
						objectID: artistID,
					});
				}

				throw new Error(`Error uploading artist: ${(error as Error).message}`);
			}
		});
	};
