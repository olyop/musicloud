import { PoolOrClient, exists } from "@oly_op/pg-helpers";
import { trim } from "lodash-es";

import { List, Song } from "./types";

const checkRelationships = (pg: PoolOrClient) => async (albumArtists: List, songs: Song[]) => {
	for (const albumArtist of albumArtists) {
		const artistExists = await exists(pg)({
			column: "name",
			table: "artists",
			value: trim(albumArtist.value),
		});
		if (!artistExists) {
			throw new Error(`Artist ${albumArtist.value} does not exist`);
		}
	}
	for (const song of songs) {
		for (const genre of song.genres) {
			const genreExists = await exists(pg)({
				column: "name",
				table: "genres",
				value: trim(genre.value),
			});
			if (!genreExists) {
				throw new Error(`Genre ${genre.value} on ${song.title} does not exist`);
			}
		}
		for (const artist of song.artists) {
			const artistExists = await exists(pg)({
				column: "name",
				table: "artists",
				value: trim(artist.value),
			});
			if (!artistExists) {
				throw new Error(`Artist ${artist.value} on ${song.title} does not exist`);
			}
		}
		for (const remixer of song.remixers) {
			const remixerExists = await exists(pg)({
				column: "name",
				table: "artists",
				value: trim(remixer.value),
			});
			if (!remixerExists) {
				throw new Error(`Remixer ${remixer.value} on ${song.title} does not exist`);
			}
		}
		for (const feature of song.featuring) {
			const featureExists = await exists(pg)({
				column: "name",
				table: "artists",
				value: trim(feature.value),
			});
			if (!featureExists) {
				throw new Error(`Feature ${feature.value} on ${song.title} does not exist`);
			}
		}
	}
};

export default checkRelationships;
