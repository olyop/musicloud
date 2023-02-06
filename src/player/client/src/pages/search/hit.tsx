import { FC, createElement } from "react";

import Album from "../../components/album";
import Artist from "../../components/artist";
import Genre from "../../components/genre";
import Playlist from "../../components/playlist";
import Song from "../../components/song";
import User from "../../components/user";
import {
	Album as AlbumType,
	Artist as ArtistType,
	Playlist as PlaylistType,
	Song as SongType,
} from "../../types";
import { isAlbum, isArtist, isGenre, isPlaylist, isSong, isUser } from "./is-object";
import { Hit } from "./types";

const className = "PaddingHalf ItemBorder";

const SearchHit: FC<PropTypes> = ({ hit }) => {
	if (isUser(hit)) {
		return (
			<User
				showIcon
				className={className}
				user={{
					name: hit.name,
					userID: hit.objectID,
				}}
			/>
		);
	} else if (isSong(hit)) {
		return (
			<Song
				showIcon
				hidePlay
				hidePlays
				hideModal
				hideDuration
				hideInLibrary
				hideTrackNumber
				className={className}
				song={
					{
						title: hit.title,
						album: hit.album,
						genres: hit.genres,
						artists: hit.artists,
						songID: hit.objectID,
						remixers: hit.remixers,
						featuring: hit.featuring,
					} as SongType
				}
			/>
		);
	} else if (isGenre(hit)) {
		return (
			<Genre
				showIcon
				className={className}
				genre={{
					name: hit.name,
					genreID: hit.objectID,
				}}
			/>
		);
	} else if (isAlbum(hit)) {
		return (
			<Album
				showIcon
				hidePlay
				hidePlays
				hideModal
				alwaysList
				hideReleased
				hideInLibrary
				infoFadeInFromRight
				className={className}
				album={
					{
						title: hit.title,
						artists: hit.artists,
						albumID: hit.objectID,
						remixers: hit.remixers,
					} as Partial<AlbumType> as AlbumType
				}
			/>
		);
	} else if (isArtist(hit)) {
		return (
			<Artist
				showIcon
				hidePlay
				hideModal
				alwaysList
				hideInLibrary
				hideArtistLower
				artist={
					{
						name: hit.name,
						artistID: hit.objectID,
					} as Partial<ArtistType> as ArtistType
				}
			/>
		);
	} else if (isPlaylist(hit)) {
		return (
			<Playlist
				hidePlay
				hidePlays
				hideModal
				hideInLibrary
				playlist={
					{
						user: hit.user,
						title: hit.title,
						playlistID: hit.objectID,
					} as Partial<PlaylistType> as PlaylistType
				}
			/>
		);
	} else {
		return null;
	}
};

interface PropTypes {
	hit: Hit;
}

export default SearchHit;
