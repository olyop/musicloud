import limit from "p-limit";
import { query, convertTableToCamelCase, join } from "@oly_op/pg-helpers";

import resolver from "./resolver";
import { Artist, Song } from "../../types";
import { handleInLibrary } from "../helpers";
import { COLUMN_NAMES } from "../../globals";
import { SELECT_SONGS, SELECT_ARTISTS } from "../../sql";

const pLimitter = limit(50);

export const addCatalogToLibrary = resolver(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const [songs, artists] = await Promise.all([
		query(context.pg)(SELECT_SONGS)({
			parse: convertTableToCamelCase<Song>(),
			variables: {
				columnNames: join(COLUMN_NAMES.SONG),
			},
		}),
		query(context.pg)(SELECT_ARTISTS)({
			parse: convertTableToCamelCase<Artist>(),
			variables: {
				columnNames: join(COLUMN_NAMES.ARTIST),
			},
		}),
	]);

	const songsPromises = songs.map(({ songID }) =>
		pLimitter(() =>
			handleInLibrary(context.pg)({
				userID,
				inLibrary: true,
				skipExists: true,
				typeName: "Song",
				objectID: songID,
				tableName: "songs",
				columnKey: "songID",
				useTransaction: false,
				columnNames: COLUMN_NAMES.SONG,
				columnName: COLUMN_NAMES.SONG[0],
				libraryTableName: "library_songs",
			}),
		),
	);

	const artistsPromises = artists.map(({ artistID }) =>
		pLimitter(() =>
			handleInLibrary(context.pg)({
				userID,
				inLibrary: true,
				skipExists: true,
				typeName: "Artist",
				objectID: artistID,
				tableName: "artists",
				useTransaction: false,
				columnKey: "artistID",
				columnNames: COLUMN_NAMES.ARTIST,
				columnName: COLUMN_NAMES.ARTIST[0],
				libraryTableName: "library_artists",
			}),
		),
	);

	await Promise.all([...songsPromises, ...artistsPromises]);
});
