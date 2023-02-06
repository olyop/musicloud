import { ApolloClient } from "@apollo/client";

import { FeedItemVars } from "../../../../../components/feed";
import { GetAlbumAtIndexData, GetAlbumsTotalData } from "../../../../../pages/library/albums";
import GET_LIBRARY_ALBUM_AT_INDEX from "../../../../../pages/library/albums/get-library-album-at-index.gql";
import GET_LIBRARY_ALBUMS_TOTAL from "../../../../../pages/library/albums/get-library-albums-total.gql";
import { GetSongAtIndexData, GetSongsTotalData } from "../../../../../pages/library/songs";
import GET_LIBRARY_SONG_AT_INDEX from "../../../../../pages/library/songs/get-library-song-at-index.gql";
import GET_LIBRARY_SONGS_TOTAL from "../../../../../pages/library/songs/get-library-songs-total.gql";
import { DownloadOptions } from "../../types";
import downloadSongAlbumCovers from "./album-covers";
import { downloadAlbumPage } from "./album-page";
import { downloadSongArtistsAndGenres } from "./artists-and-genres";
import downloadSongMP3 from "./mp3";
import { downloadSongPage } from "./page";

const downloadSongs = (client: ApolloClient<unknown>) => async (options: DownloadOptions) => {
	const {
		setDownloadText,
		setDownloadStatus,
		setCurrentDownload,
		librarySongsOrderBy,
		songsOrderBy,
		albumsOrderBy,
	} = options;

	const { data: songsTotalData } = await client.query<GetSongsTotalData>({
		query: GET_LIBRARY_SONGS_TOTAL,
	});

	const { data: albumsTotalData } = await client.query<GetAlbumsTotalData>({
		query: GET_LIBRARY_ALBUMS_TOTAL,
	});

	const { songsTotal } = songsTotalData.getLibrary;
	const { albumsTotal } = albumsTotalData.getLibrary;

	if (songsTotal && albumsTotal) {
		for (let index = 0; index <= albumsTotal; index += 1) {
			await client.query<GetAlbumAtIndexData, FeedItemVars>({
				query: GET_LIBRARY_ALBUM_AT_INDEX,
				variables: {
					input: {
						atIndex: index,
						orderBy: albumsOrderBy,
					},
				},
			});
		}

		const genresAlreadyDownloaded = new Set<string>();
		const albumsAlreadyDownloaded = new Set<string>();
		const artistsAlreadyDownloaded = new Set<string>();

		for (let index = 0; index <= songsTotal; index += 1) {
			setDownloadStatus([index, songsTotal]);

			setDownloadText("Downloading song metadata");
			const result = await client.query<GetSongAtIndexData, FeedItemVars>({
				query: GET_LIBRARY_SONG_AT_INDEX,
				variables: {
					input: {
						atIndex: index,
						orderBy: librarySongsOrderBy,
					},
				},
			});

			const { songAtIndex } = result.data.getLibrary;

			if (songAtIndex) {
				setCurrentDownload(songAtIndex);

				const {
					songID,
					album: { albumID },
				} = songAtIndex;

				setDownloadText("Downloading song audio");
				await downloadSongMP3({ songID });

				setDownloadText("Downloading song page");
				await downloadSongPage(client, { songID });

				if (!albumsAlreadyDownloaded.has(albumID)) {
					albumsAlreadyDownloaded.add(albumID);

					setDownloadText("Downloading song album cover");

					await downloadSongAlbumCovers({ albumID });

					setDownloadText("Downloading song page");
					await downloadAlbumPage(client, { albumID });
				}

				setDownloadText("Downloading song albums & genres");
				await downloadSongArtistsAndGenres(
					client,
					songAtIndex,
					{ songsOrderBy, albumsOrderBy },
					genresAlreadyDownloaded,
					artistsAlreadyDownloaded,
				);

				await new Promise(resolve => {
					setTimeout(resolve, 2000);
				});
			}
		}
	}
};

export default downloadSongs;
