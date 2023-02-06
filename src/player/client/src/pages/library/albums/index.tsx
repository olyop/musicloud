import { createBEM } from "@oly_op/bem";
import { FC, createElement } from "react";

import Album from "../../../components/album";
import Albums from "../../../components/albums";
import Feed from "../../../components/feed";
import { useStateListStyle } from "../../../redux";
import { Album as AlbumType, SettingsListStyle } from "../../../types";
import GET_LIBRARY_ALBUM_AT_INDEX from "./get-library-album-at-index.gql";
import GET_LIBRARY_ALBUMS_TOTAL from "./get-library-albums-total.gql";
import "./index.scss";

const bem = createBEM("LibraryAlbums");

const LibraryAlbums: FC = () => {
	const listStyle = useStateListStyle();
	const isList = listStyle === SettingsListStyle.LIST;
	return (
		<Albums className={bem(isList ? "Content" : "PaddingLeftRight")}>
			<Feed<GetAlbumsTotalData, AlbumType, GetAlbumAtIndexData>
				settingsOrderBy="albums"
				itemQuery={GET_LIBRARY_ALBUM_AT_INDEX}
				itemsTotalQuery={GET_LIBRARY_ALBUMS_TOTAL}
				itemDataToValue={({ getLibrary }) => getLibrary.albumAtIndex}
				itemsTotalDataToValue={({ getLibrary }) => getLibrary.albumsTotal}
				renderItem={(ref, album) => (
					<Album
						ref={ref}
						hidePlays
						album={album}
						infoFadeInFromRight={!isList}
						className={isList ? bem("list", "PaddingHalf ItemBorder") : bem("grid")}
					/>
				)}
			/>
		</Albums>
	);
};

export interface GetAlbumsTotalData {
	getLibrary: {
		albumsTotal: number | null;
	};
}

export interface GetAlbumAtIndexData {
	getLibrary: {
		albumAtIndex: AlbumType | null;
	};
}

export default LibraryAlbums;
