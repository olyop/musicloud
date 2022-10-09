import {
	AlbumID,
	AlbumIDTitleBase,
	ArtistIDNameBase,
	AlgoliaRecordAlbum,
} from "@oly_op/musicloud-common/build/types";

import { trim } from "lodash-es";
import { FastifyPluginAsync } from "fastify";
import { query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers";

import {
	addRecordToSearchIndex,
	deleteRecordFromSearchIndex,
	determineCatalogImageURL,
	normalizeImageAndUploadToS3,
} from "../helpers";

import uploadSong from "./upload-song";
import coverInputs from "./cover-inputs";
import getArtistID from "./get-artist-id";
import { List, Route, Song } from "./types";
import checkRelationships from "./check-relationships";
import { INSERT_ALBUM, INSERT_ALBUM_ARTIST } from "./sql";

export const uploadAlbum: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>("/album", { onRequest: fastify.authenticate }, async (request, reply) => {
			const { body } = request;
			const { cover, released } = body;

			const albumTitle = trim(body.title);

			const songs = JSON.parse(body.songs) as Song[];

			const albumArtistsList = JSON.parse(body.artists) as List;

			console.log(`Checking ${albumTitle} relationships`);

			await checkRelationships(fastify.pg.pool)(albumArtistsList, songs);

			console.log(`Start Album Upload: ${albumTitle}`);

			let albumID: string | null = null;
			const client = await fastify.pg.pool.connect();

			try {
				await client.query("BEGIN");

				const result = await query(client)(INSERT_ALBUM)({
					parse: convertFirstRowToCamelCase<AlbumID>(),
					variables: [
						{
							key: "released",
							value: released,
							parameterized: true,
						},
						{
							key: "title",
							value: albumTitle,
							parameterized: true,
						},
					],
				});

				albumID = result.albumID;

				await normalizeImageAndUploadToS3(fastify.s3)({
					objectID: albumID,
					images: coverInputs,
					buffer: cover[0]!.data,
				});

				const album: AlbumIDTitleBase = {
					albumID,
					title: albumTitle,
				};

				const albumCoverURL = determineCatalogImageURL(albumID, coverInputs[2]!);

				const albumArtists: ArtistIDNameBase[] = [];

				for (const artistItem of albumArtistsList) {
					const { index } = artistItem;
					const name = trim(artistItem.value);

					const artistID = await getArtistID(client)(name);

					await query(client)(INSERT_ALBUM_ARTIST)({
						variables: {
							index,
							albumID,
							artistID,
						},
					});

					albumArtists.push({ artistID, name });
				}

				await addRecordToSearchIndex(fastify.ag.index)<AlgoliaRecordAlbum>({
					plays: 0,
					remixers: [],
					title: albumTitle,
					typeName: "Album",
					objectID: albumID,
					image: albumCoverURL,
					artists: albumArtists,
				});

				for (const song of songs) {
					await uploadSong(
						client,
						fastify.s3,
						fastify.ag.index,
					)({
						album,
						albumCoverURL,
						albumID,
						body,
						song,
					});
				}

				await client.query("COMMIT");

				console.log(`Finish Album Upload: ${albumTitle}`);

				void reply.code(201);

				return { albumID };
			} catch (error) {
				await client.query("ROLLBACK");

				if (albumID) {
					await deleteRecordFromSearchIndex(fastify.ag.index)({
						objectID: albumID,
					});
				}

				throw new Error(`Error uploading album: ${(error as Error).message}`);
			}
		});
	};
