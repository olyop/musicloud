import { createElement, FC } from "react";
import { useParams } from "react-router-dom";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import { ArtistID } from "@oly_op/musicloud-common/build/types";

import { useQuery } from "../../hooks";
import Song from "../../components/song";
import Songs from "../../components/songs";
import { ArtistTopTenSongs } from "../../types";

import GET_ARTIST_PAGE_HOME from "./get-artist-page-home.gql";

const ArtistPageHome: FC = () => {
	const params = useParams<keyof ArtistID>();
	const artistID = addDashesToUUID(params.artistID!);

	const { data } = useQuery<ArtistPageHomeData, ArtistID>(GET_ARTIST_PAGE_HOME, {
		variables: { artistID },
	});

	return (
		<div className="ContentPaddingTopBottom">
			<h1 className="HeadingFive PaddingBottomHalf">Most Played</h1>
			<Songs songs={data?.getArtistByID.topTenSongs}>
				{songs => songs.map(song => <Song song={song} hideTrackNumber key={song.songID} />)}
			</Songs>
		</div>
	);
};

interface ArtistPageHomeData {
	getArtistByID: ArtistTopTenSongs;
}

export default ArtistPageHome;
