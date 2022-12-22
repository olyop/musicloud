import { ArtistID } from "@oly_op/musicloud-common/build/types";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import { FC, createElement } from "react";
import { useParams } from "react-router-dom";

import Song from "../../components/song";
import Songs from "../../components/songs";
import { useQuery } from "../../hooks";
import { useStateOrderBy } from "../../redux";
import {
	ArtistSongs,
	OrderByOptions,
	SettingsOrderBySongs,
	SongsOrderBy,
	SongsOrderByField,
} from "../../types";
import GET_ARTIST_PAGE_SONGS from "./get-artist-page-songs.gql";

const orderBy: OrderByOptions<SettingsOrderBySongs> = {
	key: "songs",
	fields: Object.keys(SongsOrderByField),
};

const ArtistPageSongs: FC = () => {
	const params = useParams<keyof ArtistID>();
	const artistID = addDashesToUUID(params.artistID!);
	const songsOrderBy = useStateOrderBy<SongsOrderByField>("songs");

	const { data } = useQuery<ArtistPageSongsData, ArtistPageSongsVars>(GET_ARTIST_PAGE_SONGS, {
		variables: { artistID, songsOrderBy },
	});

	return (
		<div className="ContentPaddingTopBottom">
			<Songs orderBy={orderBy} songs={data?.getArtistByID.songs}>
				{songs => songs.map(song => <Song song={song} hideTrackNumber key={song.songID} />)}
			</Songs>
		</div>
	);
};

interface ArtistPageSongsData {
	getArtistByID: ArtistSongs;
}

interface ArtistPageSongsVars extends ArtistID {
	songsOrderBy: SongsOrderBy;
}

export default ArtistPageSongs;
