import { createElement, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types"

import {
	isUser,
	isSong,
	isAlbum,
	isGenre,
	isArtist,
	isPlaylist,
} from "./is-object"

import { Hit } from "./types"
import User from "../../components/user"
import Item from "../../components/item"
import Song from "../../components/song"
import Genre from "../../components/genre"
import Artist from "../../components/artist"
import ObjectLink from "../../components/object-link"
import ObjectLinks from "../../components/object-links"
import { Song as SongType, Artist as ArtistType } from "../../types"
import { createCatalogImageURL, createObjectPath } from "../../helpers"

const className =
	"PaddingHalf ItemBorder"

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
		)
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
				song={{
					title: hit.title,
					album: hit.album,
					genres: hit.genres,
					artists: hit.artists,
					songID: hit.objectID,
					remixers: hit.remixers,
					featuring: hit.featuring,
				} as SongType}
			/>
		)
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
		)
	} else if (isAlbum(hit)) {
		return (
			<Item
				leftIcon="album"
				className={className}
				infoOptions={{
					upperLeft: (
						<ObjectLink
							link={{
								text: hit.title,
								path: createObjectPath("album", hit.objectID),
							}}
						/>
					),
					lowerLeft: (
						<ObjectLinks
							links={hit.artists.map(({ artistID, name }) => ({
								text: name,
								path: createObjectPath("artist", artistID),
							}))}
						/>
					),
				}}
				imageOptions={{
					title: hit.title,
					path: createObjectPath(
						"album",
						hit.objectID,
					),
					url: createCatalogImageURL(
						hit.objectID,
						"cover",
						ImageSizes.MINI,
						ImageDimensions.SQUARE,
					),
				}}
			/>
		)
	} else if (isArtist(hit)) {
		return (
			<Artist
				hideModal
				alwaysList
				hideInLibrary
				hideArtistLower
				artist={({
					name: hit.name,
					artistID: hit.objectID,
				} as Partial<ArtistType>) as ArtistType}
			/>
		)
	} else if (isPlaylist(hit)) {
		return (
			<Item
				className={className}
				leftIcon="queue_music"
				infoOptions={{
					upperLeft: (
						<ObjectLink
							link={{
								text: hit.title,
								path: createObjectPath("playlist", hit.objectID),
							}}
						/>
					),
					lowerLeft: (
						<ObjectLink
							link={{
								text: hit.user.name,
								path: createObjectPath("user", hit.user.userID),
							}}
						/>
					),
				}}
			/>
		)
	} else {
		return null
	}
}

interface PropTypes {
	hit: Hit,
}

export default SearchHit