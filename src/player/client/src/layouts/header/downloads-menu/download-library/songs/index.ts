import { ApolloClient } from "@apollo/client";

import downloadSongMP3 from "./download-song-mp3";
import { SetCurrentDownload, SetStatus } from "../../types";
import downloadSongAlbumCovers from "./download-song-album-covers";

import { FeedItemVars } from "../../../../../components/feed";
import { GetSongsTotalData, GetSongAtIndexData } from "../../../../../pages/library/songs";
import {
	LibrarySongsOrderBy,
	LibrarySongsOrderByField,
	OrderByDirection,
} from "../../../../../types";

import GET_LIBRARY_SONGS_TOTAL from "../../../../../pages/library/songs/get-library-songs-total.gql";
import GET_LIBRARY_SONG_AT_INDEX from "../../../../../pages/library/songs/get-library-song-at-index.gql";

const orderBy: LibrarySongsOrderBy = {
	direction: OrderByDirection.ASC,
	field: LibrarySongsOrderByField.TITLE,
};

const downloadSongs =
	(client: ApolloClient<unknown>) =>
	async (setCurrentDownload: SetCurrentDownload, setStatus: SetStatus) => {
		const { data } = await client.query<GetSongsTotalData>({
			query: GET_LIBRARY_SONGS_TOTAL,
		});

		if (data.getLibrary.songsTotal) {
			const { songsTotal } = data.getLibrary;
			for (let index = 0; index <= songsTotal; index += 1) {
				setStatus([index, songsTotal]);

				const {
					data: {
						getLibrary: { songAtIndex },
					},
				} = await client.query<GetSongAtIndexData, FeedItemVars>({
					query: GET_LIBRARY_SONG_AT_INDEX,
					variables: {
						input: {
							orderBy,
							atIndex: index,
						},
					},
				});

				if (songAtIndex) {
					setCurrentDownload(songAtIndex);
					const {
						songID,
						album: { albumID },
					} = songAtIndex;

					await downloadSongMP3({ songID });
					await downloadSongAlbumCovers({ albumID });
				}
			}
		}
	};

export default downloadSongs;
