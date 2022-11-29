import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { addPrefix, convertTableToCamelCase, query } from "@oly_op/pg-helpers";
import limit from "p-limit";

import { SELECT_ARTISTS, SELECT_SONGS } from "../../sql";
import { Artist, Song } from "../../types";
import { addArtistToLibraryHelper, addSongToLibraryHelper } from "../helpers";
import resolver from "./resolver";

const pLimitter = limit(50);

export const addCatalogToLibrary = resolver(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const [songs, artists] = await Promise.all([
		query(context.pg)(SELECT_SONGS)({
			parse: convertTableToCamelCase<Song>(),
			variables: {
				columnNames: addPrefix(COLUMN_NAMES.SONG),
			},
		}),
		query(context.pg)(SELECT_ARTISTS)({
			parse: convertTableToCamelCase<Artist>(),
			variables: {
				columnNames: addPrefix(COLUMN_NAMES.ARTIST),
			},
		}),
	]);

	const songsPromises = songs.map(({ songID }) =>
		pLimitter(() =>
			addSongToLibraryHelper(context.pg)({
				userID,
			})({ songID }),
		),
	);

	const artistsPromises = artists.map(({ artistID }) =>
		pLimitter(() =>
			addArtistToLibraryHelper(context.pg)({
				userID,
			})({ artistID }),
		),
	);

	await Promise.all([...songsPromises, ...artistsPromises]);
});
