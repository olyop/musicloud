import { createElement, FC, Fragment } from "react"

import {
	isUser,
	isSong,
	isGenre,
	isAlbum,
	isArtist,
	isPlaylist,
} from "./is-object"

import User from "../../components/user"
import Song from "../../components/song"
import Genre from "../../components/genre"
import Album from "../../components/album"
import Artist from "../../components/artist"
import Playlist from "../../components/playlist"
import { Search as SearchType } from "../../types"

const className =
	"PaddingHalf ItemBorder"

const Search: FC<PropTypes> = ({ object }) => {
	if (isUser(object)) {
		return (
			<User
				showIcon
				user={object}
				className={className}
			/>
		)
	} else if (isSong(object)) {
		return (
			<Song
				leftIcon
				hidePlays
				hideDuration
				song={object}
				hideTrackNumber
				className={className}
			/>
		)
	} else if (isGenre(object)) {
		return (
			<Genre
				leftIcon
				genre={object}
				className={className}
			/>
		)
	} else if (isAlbum(object)) {
		return (
			<Album
				leftIcon
				alwaysList
				hideReleased
				album={object}
				className={className}
			/>
		)
	} else if (isArtist(object)) {
		return (
			<Artist
				leftIcon
				alwaysList
				artist={object}
				className={className}
			/>
		)
	} else if (isPlaylist(object)) {
		return (
			<Playlist
				leftIcon
				playlist={object}
				className={className}
			/>
		)
	} else {
		return (
			<Fragment>
				{null}
			</Fragment>
		)
	}
}

interface PropTypes {
	object: SearchType,
}

export default Search