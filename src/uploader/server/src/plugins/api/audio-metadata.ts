// eslint-disable-next-line import/no-unresolved
import { parseBuffer } from "music-metadata";

import { isEmpty, trim } from "lodash-es";
import { FastifyPluginAsync } from "fastify";
import { SongAudioMetadataBase } from "@oly_op/musicloud-common/build/types";

import { BodyEntry } from "./types";

interface Reply extends SongAudioMetadataBase {
	cover: Buffer | null;
}

interface Route {
	Body: {
		audio: BodyEntry[];
	};
	Reply: Reply;
}

const toList = (value: string) =>
	value
		.split(/(,|&|feat.)/)
		.map(trim)
		.filter(x => !(x === "," || x === "&" || x === "feat."));

export const audioMetadata: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.put<Route>("/audio-metadata", { onRequest: fastify.authenticate }, async request => {
			const body = request.body.audio[0];
			if (body) {
				const { common } = await parseBuffer(body.data);
				const { title, album, year, disk, track, artist, genre, picture } = common;
				return {
					year: year || null,
					title: title || null,
					album: album || null,
					discNumber: disk.no || null,
					trackNumber: track.no || null,
					cover: picture && picture[0] ? picture[0].data : null,
					mix: title ? (title.includes("Extended") ? "Extended" : null) : null,
					artists: artist ? (isEmpty(toList(artist)) ? null : toList(artist)) : null,
					genres: genre && genre[0] ? (isEmpty(toList(genre[0])) ? null : toList(genre[0])) : null,
				};
			} else {
				throw new Error("`body.audio` not provided.");
			}
		});
	};
