import { FC, createElement } from "react";

import Feed from "../../../components/feed";
import Song from "../../../components/song";
import Songs from "../../../components/songs";
import {
	LibrarySongsOrderByField,
	OrderByOptions,
	SettingsOrderBySongs,
	Song as SongType,
} from "../../../types";
import GET_LIBRARY_SONG_AT_INDEX from "./get-library-song-at-index.gql";
import GET_LIBRARY_SONGS_TOTAL from "./get-library-songs-total.gql";
import "./index.scss";

const orderBy: OrderByOptions<SettingsOrderBySongs> = {
	key: "librarySongs",
	fields: Object.keys(LibrarySongsOrderByField),
};

const LibrarySongs: FC = () => (
	<Songs orderBy={orderBy} className="Content Elevated">
		<Feed<GetSongsTotalData, SongType, GetSongAtIndexData>
			settingsOrderBy="librarySongs"
			itemQuery={GET_LIBRARY_SONG_AT_INDEX}
			itemsTotalQuery={GET_LIBRARY_SONGS_TOTAL}
			itemDataToValue={({ getLibrary }) => getLibrary.songAtIndex}
			itemsTotalDataToValue={({ getLibrary }) => getLibrary.songsTotal}
			renderItem={(ref, song) => (
				<Song hidePlays ref={ref} song={song} className="LibrarySong PaddingHalf ItemBorder" />
			)}
		/>
	</Songs>
);

export interface GetSongsTotalData {
	getLibrary: {
		songsTotal: number | null;
	};
}

export interface GetSongAtIndexData {
	getLibrary: {
		songAtIndex: SongType | null;
	};
}

export default LibrarySongs;
