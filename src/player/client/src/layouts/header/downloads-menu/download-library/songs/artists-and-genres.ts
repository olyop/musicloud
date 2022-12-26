import { ApolloClient } from "@apollo/client";
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";

import { createCatalogImageURL } from "../../../../../helpers";
import GET_ARTIST_PAGE_ALBUMS from "../../../../../pages/artist/get-artist-page-albums.gql";
import GET_ARTIST_PAGE_HOME from "../../../../../pages/artist/get-artist-page-home.gql";
import GET_ARTIST_PAGE_SONGS from "../../../../../pages/artist/get-artist-page-songs.gql";
import GET_ARTIST_PAGE from "../../../../../pages/artist/get-artist-page.gql";
import GET_GENRE_PAGE from "../../../../../pages/genre/get-genre-page.gql";
import { Song } from "../../../../../types";
import { DownloadArtistPageOrderByOptions, DownloadSongsOrderByOptions } from "../../types";

const downloadArtistPages = async (
	client: ApolloClient<unknown>,
	artistID: string,
	{ songsOrderBy, albumsOrderBy }: DownloadArtistPageOrderByOptions,
) => {
	await client.query({
		query: GET_ARTIST_PAGE,
		variables: {
			artistID,
		},
	});
	await client.query({
		query: GET_ARTIST_PAGE_HOME,
		variables: {
			artistID,
		},
	});
	await client.query({
		query: GET_ARTIST_PAGE_SONGS,
		variables: {
			artistID,
			songsOrderBy,
		},
	});
	await client.query({
		query: GET_ARTIST_PAGE_ALBUMS,
		variables: {
			artistID,
			orderBy: albumsOrderBy,
		},
	});
};

const downloadArtistImages = async (client: ApolloClient<unknown>, artistID: string) => {
	await fetch(createCatalogImageURL(artistID, "cover", ImageSizes.HALF, ImageDimensions.LANDSCAPE));
	await fetch(createCatalogImageURL(artistID, "cover", ImageSizes.FULL, ImageDimensions.LANDSCAPE));
	await fetch(createCatalogImageURL(artistID, "profile", ImageSizes.MINI, ImageDimensions.SQUARE));
	await fetch(createCatalogImageURL(artistID, "profile", ImageSizes.HALF, ImageDimensions.SQUARE));
};

const downloadArtist = async (
	client: ApolloClient<unknown>,
	artistID: string,
	{ songsOrderBy, albumsOrderBy }: DownloadArtistPageOrderByOptions,
	artistsAlreadyDownloaded: Set<string>,
) => {
	if (!artistsAlreadyDownloaded.has(artistID)) {
		await downloadArtistImages(client, artistID);
		await downloadArtistPages(client, artistID, { songsOrderBy, albumsOrderBy });
		artistsAlreadyDownloaded.add(artistID);
	}
};

const downloadGenre = async (
	client: ApolloClient<unknown>,
	genreID: string,
	{ songsOrderBy }: DownloadSongsOrderByOptions,
	genresAlreadyDownloaded: Set<string>,
) => {
	if (!genresAlreadyDownloaded.has(genreID)) {
		await client.query({
			query: GET_GENRE_PAGE,
			variables: {
				genreID,
				songsOrderBy,
			},
		});
			genresAlreadyDownloaded.add(genreID);
	}
};

export const downloadSongArtistsAndGenres = async (
	client: ApolloClient<unknown>,
	song: Song,
	orderByOptions: DownloadArtistPageOrderByOptions,
	genresAlreadyDownloaded: Set<string>,
	artistsAlreadyDownloaded: Set<string>,
) => {
	for (const { artistID } of song.artists) {
		await downloadArtist(client, artistID, orderByOptions, artistsAlreadyDownloaded);
	}

	for (const { artistID } of song.remixers) {
		await downloadArtist(client, artistID, orderByOptions, artistsAlreadyDownloaded);
	}

	for (const { artistID } of song.featuring) {
		await downloadArtist(client, artistID, orderByOptions, artistsAlreadyDownloaded);
	}

	for (const { genreID } of song.genres) {
		await downloadGenre(client, genreID, orderByOptions, genresAlreadyDownloaded);
	}
};
