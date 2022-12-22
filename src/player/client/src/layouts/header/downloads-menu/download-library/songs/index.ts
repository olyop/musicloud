import { ApolloClient } from "@apollo/client";

import { FeedItemVars } from "../../../../../components/feed";
import { GetSongAtIndexData, GetSongsTotalData } from "../../../../../pages/library/songs";
import GET_LIBRARY_SONG_AT_INDEX from "../../../../../pages/library/songs/get-library-song-at-index.gql";
import GET_LIBRARY_SONGS_TOTAL from "../../../../../pages/library/songs/get-library-songs-total.gql";
import {
	LibrarySongsOrderBy,
	LibrarySongsOrderByField,
	OrderByDirection,
} from "../../../../../types";
import { SetCurrentDownload, SetStatus } from "../../types";
import downloadSongAlbumCovers from "./album-covers";
import { downloadAlbumPage } from "./album-page";
import { downloadSongArtistsAndGenres } from "./artists-and-genres";
import downloadSongMP3 from "./mp3";
import { downloadSongPage } from "./page";

const orderBy: LibrarySongsOrderBy = {
	direction: OrderByDirection.ASC,
	field: LibrarySongsOrderByField.TITLE,
};

const downloadSongs =
	(client: ApolloClient<unknown>) =>
	async (setCurrentDownload: SetCurrentDownload, setStatus: SetStatus) => {
		const { data } = await client.query<GetSongsTotalData>({
			query: GET_LIBRARY_SONGS_TOTAL,
			fetchPolicy: "network-only",
		});

		if (data.getLibrary.songsTotal) {
			const { songsTotal } = data.getLibrary;
			for (let index = 0; index <= songsTotal; index += 1) {
				setStatus([index, songsTotal]);

				const result = await client.query<GetSongAtIndexData, FeedItemVars>({
					query: GET_LIBRARY_SONG_AT_INDEX,
					fetchPolicy: "network-only",
					variables: {
						input: {
							orderBy,
							atIndex: index,
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

					await Promise.all([
						downloadSongMP3({ songID }),
						downloadSongAlbumCovers({ albumID }),
						downloadSongPage(client, { songID }),
						downloadAlbumPage(client, { albumID }),
						downloadSongArtistsAndGenres(client, songAtIndex),
					]);
				}
			}
		}
	};

export default downloadSongs;
