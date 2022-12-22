import { GenreID } from "@oly_op/musicloud-common/build/types";
import { Head } from "@oly_op/react-head";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import isUndefined from "lodash-es/isUndefined";
import { FC, createElement } from "react";
import { useParams } from "react-router-dom";

import Song from "../../components/song";
import Songs from "../../components/songs";
import { useQuery } from "../../hooks";
import Page from "../../layouts/page";
import { useStateOrderBy } from "../../redux";
import {
	Genre,
	OrderByOptions,
	SettingsOrderBySongs,
	SongsOrderBy,
	SongsOrderByField,
} from "../../types";
import GET_GENRE_PAGE from "./get-genre-page.gql";

const orderBy: OrderByOptions<SettingsOrderBySongs> = {
	key: "songs",
	fields: Object.keys(SongsOrderByField),
};

const GenrePage: FC = () => {
	const params = useParams<keyof GenreID>();
	const genreID = addDashesToUUID(params.genreID!);
	const songsOrderBy = useStateOrderBy<SongsOrderByField>("songs");

	const { data, error } = useQuery<GetGenrePageData, GetGenrePageVars>(GET_GENRE_PAGE, {
		variables: { songsOrderBy, genreID },
	});

	if (!isUndefined(error)) {
		return (
			<Page>
				<h2 className="ParagraphOne">
					{error.message === "Failed to fetch" ? error.message : "Genre does not exist."}
				</h2>
			</Page>
		);
	} else if (isUndefined(data)) {
		return <Page />;
	} else {
		const { songs } = data.getGenreByID;
		return (
			<Head pageTitle={data.getGenreByID.name}>
				<Page childrenClassName="PaddingTopBottom">
					<Songs orderBy={orderBy} className="Content Elevated">
						{songs.map(song => (
							<Song song={song} key={song.songID} />
						))}
					</Songs>
				</Page>
			</Head>
		);
	}
};

interface GetGenrePageData {
	getGenreByID: Genre;
}

interface GetGenrePageVars extends GenreID {
	songsOrderBy: SongsOrderBy;
}

export default GenrePage;
