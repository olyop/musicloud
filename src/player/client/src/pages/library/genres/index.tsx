import { FC, createElement } from "react";

import Feed from "../../../components/feed";
import Genre from "../../../components/genre";
import Genres from "../../../components/genres";
import { Genre as GenreType } from "../../../types";
import GET_LIBRARY_GENRE_AT_INDEX from "./get-library-genre-at-index.gql";
import GET_LIBRARY_GENRES_TOTAL from "./get-library-genres-total.gql";
import "./index.scss";

const LibraryGenres: FC = () => (
	<Genres orderBy className="Content Elevated">
		<Feed<GetGenresTotalData, GenreType, GetGenreAtIndexData>
			settingsOrderBy="genres"
			itemQuery={GET_LIBRARY_GENRE_AT_INDEX}
			itemsTotalQuery={GET_LIBRARY_GENRES_TOTAL}
			itemDataToValue={({ getLibrary }) => getLibrary.genreAtIndex}
			itemsTotalDataToValue={({ getLibrary }) => getLibrary.genresTotal}
			renderItem={(ref, genre) => (
				<Genre ref={ref} genre={genre} className="LibraryGenre PaddingHalf ItemBorder" />
			)}
		/>
	</Genres>
);

interface GetGenresTotalData {
	getLibrary: {
		genresTotal: number | null;
	};
}

interface GetGenreAtIndexData {
	getLibrary: {
		genreAtIndex: GenreType | null;
	};
}

export default LibraryGenres;
