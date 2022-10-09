import { ApolloClient } from "@apollo/client";

import { SetCurrentDownload, SetStatus } from "../types";
import downloadSongs from "./songs";

// import GET_LIBRARY_GENRES_TOTAL from "../../../../pages/library/genres/get-library-genres-total.gql"
// import GET_LIBRARY_GENRE_AT_INDEX from "../../../../pages/library/genres/get-library-genre-at-index.gql"
// import GET_LIBRARY_ALBUMS_TOTAL from "../../../../pages/library/albums/get-library-albums-total.gql"
// import GET_LIBRARY_ALBUM_AT_INDEX from "../../../../pages/library/albums/get-library-album-at-index.gql"
// import GET_LIBRARY_ARTISTS_TOTAL from "../../../../pages/library/artists/get-library-artists-total.gql"
// import GET_LIBRARY_ARTIST_AT_INDEX from "../../../../pages/library/artists/get-library-artist-at-index.gql"
// import GET_LIBRARY_PLAYLISTS_TOTAL from "../../../../pages/library/playlists/get-library-playlists-total.gql"
// import GET_LIBRARY_PLAYLIST_AT_INDEX from "../../../../pages/library/playlists/get-library-playlist-at-index.gql"

const downloadLibrary =
	(client: ApolloClient<unknown>) =>
	async (setCurrentDownload: SetCurrentDownload, setStatus: SetStatus) => {
		await downloadSongs(client)(setCurrentDownload, setStatus);
	};

export default downloadLibrary;
