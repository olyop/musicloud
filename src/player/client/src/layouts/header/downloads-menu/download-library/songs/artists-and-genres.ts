import { ApolloClient } from "@apollo/client";
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";

import { createCatalogImageURL } from "../../../../../helpers";
import GET_ARTIST_PAGE from "../../../../../pages/artist/get-artist-page.gql";
import GET_GENRE_PAGE from "../../../../../pages/genre/get-genre-page.gql";
import { Song } from "../../../../../types";

export const downloadSongArtistsAndGenres = async (client: ApolloClient<unknown>, song: Song) => {
	const { artists, remixers, featuring, genres } = song;

	await Promise.all([
		...artists.map(({ artistID }) =>
			client.query({
				query: GET_ARTIST_PAGE,
				variables: {
					artistID,
				},
			}),
		),
		...artists.map(({ artistID }) => [
			fetch(createCatalogImageURL(artistID, "cover", ImageSizes.HALF, ImageDimensions.LANDSCAPE)),
			fetch(createCatalogImageURL(artistID, "cover", ImageSizes.FULL, ImageDimensions.LANDSCAPE)),
			fetch(createCatalogImageURL(artistID, "profile", ImageSizes.MINI, ImageDimensions.SQUARE)),
			fetch(createCatalogImageURL(artistID, "profile", ImageSizes.HALF, ImageDimensions.SQUARE)),
		]),
		...remixers.map(({ artistID }) =>
			client.query({
				query: GET_ARTIST_PAGE,
				variables: {
					artistID,
				},
			}),
		),
		...remixers.map(({ artistID }) => [
			fetch(createCatalogImageURL(artistID, "cover", ImageSizes.HALF, ImageDimensions.LANDSCAPE)),
			fetch(createCatalogImageURL(artistID, "cover", ImageSizes.FULL, ImageDimensions.LANDSCAPE)),
			fetch(createCatalogImageURL(artistID, "profile", ImageSizes.MINI, ImageDimensions.SQUARE)),
			fetch(createCatalogImageURL(artistID, "profile", ImageSizes.HALF, ImageDimensions.SQUARE)),
		]),
		...featuring.map(({ artistID }) =>
			client.query({
				query: GET_ARTIST_PAGE,
				variables: {
					artistID,
				},
			}),
		),
		...featuring.map(({ artistID }) => [
			fetch(createCatalogImageURL(artistID, "cover", ImageSizes.HALF, ImageDimensions.LANDSCAPE)),
			fetch(createCatalogImageURL(artistID, "cover", ImageSizes.FULL, ImageDimensions.LANDSCAPE)),
			fetch(createCatalogImageURL(artistID, "profile", ImageSizes.MINI, ImageDimensions.SQUARE)),
			fetch(createCatalogImageURL(artistID, "profile", ImageSizes.HALF, ImageDimensions.SQUARE)),
		]),
		...genres.map(({ genreID }) =>
			client.query({
				query: GET_GENRE_PAGE,
				variables: {
					genreID,
					songsOrderBy: {
						direction: "ASC",
						field: "TITLE",
					},
				},
			}),
		),
	]);
};
