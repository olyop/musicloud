import { createBEM } from "@oly_op/bem";
import { FC, createElement } from "react";

import Artist from "../../../components/artist";
import Artists from "../../../components/artists";
import Feed from "../../../components/feed";
import { useStateListStyle } from "../../../redux";
import {
	Artist as ArtistType,
	LibraryArtistsOrderByField,
	OrderByOptions,
	SettingsListStyle,
	SettingsOrderByArtists,
} from "../../../types";
import GET_LIBRARY_ARTIST_AT_INDEX from "./get-library-artist-at-index.gql";
import GET_LIBRARY_ARTISTS_TOTAL from "./get-library-artists-total.gql";
import "./index.scss";

const orderBy: OrderByOptions<SettingsOrderByArtists> = {
	key: "libraryArtists",
	fields: Object.keys(LibraryArtistsOrderByField),
};

const bem = createBEM("LibraryArtists");

const LibraryArtists: FC = () => {
	const listStyle = useStateListStyle();
	const isList = listStyle === SettingsListStyle.LIST;
	return (
		<Artists orderBy={orderBy}>
			<Feed<GetArtistsTotalData, ArtistType, GetArtistAtIndexData>
				settingsOrderBy="libraryArtists"
				itemQuery={GET_LIBRARY_ARTIST_AT_INDEX}
				itemsTotalQuery={GET_LIBRARY_ARTISTS_TOTAL}
				itemDataToValue={({ getLibrary }) => getLibrary.artistAtIndex}
				itemsTotalDataToValue={({ getLibrary }) => getLibrary.artistsTotal}
				renderItem={(ref, artist) => (
					<Artist
						ref={ref}
						artist={artist}
						className={isList ? bem("list", "PaddingHalf ItemBorder") : bem("grid")}
					/>
				)}
			/>
		</Artists>
	);
};
interface GetArtistsTotalData {
	getLibrary: {
		artistsTotal: number | null;
	};
}

interface GetArtistAtIndexData {
	getLibrary: {
		artistAtIndex: ArtistType | null;
	};
}

export default LibraryArtists;
