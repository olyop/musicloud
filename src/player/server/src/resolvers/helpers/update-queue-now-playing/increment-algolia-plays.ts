import { ArtistID, GenreID, SongID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, convertTableToCamelCase, importSQL, query } from "@oly_op/pg-helpers";
import { SearchIndex } from "algoliasearch";

import { getSong } from "../get-objects/index.js";

const isf = importSQL(import.meta.url);

const SELECT_SONG_ARTIST_IDS = await isf("select-song-artist-ids");
const SELECT_SONG_FEATURING_IDS = await isf("select-song-featuring-ids");
const SELECT_SONG_GENRES_IDS = await isf("select-song-genres-ids");
const SELECT_SONG_REMIXERS_IDS = await isf("select-song-remixers-ids");

const incrementOne = {
	value: 1,
	_operation: "Increment",
};

export const incrementAlgoliaPlays =
	(pg: PoolOrClient, ag: SearchIndex) =>
	async ({ songID }: SongID) => {
		const [{ albumID }, genres, artists, remixers, featuring] = await Promise.all([
			getSong(pg)({ songID }),
			query(pg)(SELECT_SONG_GENRES_IDS)({
				parse: convertTableToCamelCase<GenreID>(),
				variables: {
					songID,
				},
			}),
			query(pg)(SELECT_SONG_ARTIST_IDS)({
				parse: convertTableToCamelCase<ArtistID>(),
				variables: {
					songID,
				},
			}),
			query(pg)(SELECT_SONG_REMIXERS_IDS)({
				parse: convertTableToCamelCase<ArtistID>(),
				variables: {
					songID,
				},
			}),
			query(pg)(SELECT_SONG_FEATURING_IDS)({
				parse: convertTableToCamelCase<ArtistID>(),
				variables: {
					songID,
				},
			}),
		]);

		const incrementSong = {
			objectID: songID,
			plays: incrementOne,
		};

		const incrementAlbum = {
			objectID: albumID,
			plays: incrementOne,
		};

		const incrementGenres = genres.map(({ genreID }) => ({
			objectID: genreID,
			plays: incrementOne,
		}));

		const incrementArtists = [...artists, ...remixers, ...featuring].map(({ artistID }) => ({
			objectID: artistID,
			plays: incrementOne,
		}));

		await ag.partialUpdateObjects([
			incrementSong,
			incrementAlbum,
			...incrementGenres,
			...incrementArtists,
		]);
	};
