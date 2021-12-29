import { createElement, VFC, Fragment } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import {
	isUser,
	isSong,
	isAlbum,
	isGenre,
	isArtist,
	isPlaylist,
} from "./is-object"

import { Hit } from "./types"
import Item from "../../components/item"
import SongTitle from "../../components/song-title"
import ObjectLink from "../../components/object-link"
import ObjectLinks from "../../components/object-links"
import FeaturingArtists from "../../components/featuring-artists"
import { determineCatalogImageURL, determineObjectPath } from "../../helpers"

const className =
	"PaddingHalf ItemBorder"

const SearchHit: VFC<PropTypes> = ({ hit }) => {
	if (isUser(hit)) {
		return (
			<Item
				leftIcon="person"
				className={className}
				infoOptions={{
					upperLeft: (
						<ObjectLink
							link={{
								text: hit.name,
								path: determineObjectPath("user", hit.objectID),
							}}
						/>
					),
				}}
				imageOptions={{
					title: hit.name,
					path: determineObjectPath(
						"user",
						hit.objectID,
					),
					url: determineCatalogImageURL(
						hit.objectID,
						"profile",
						ImageSizes.MINI,
						ImageDimensions.SQUARE,
					),
				}}
			/>
		)
	} else if (isSong(hit)) {
		return (
			<Item
				leftIcon="audiotrack"
				className={className}
				infoOptions={{
					upperLeft: (
						<SongTitle
							song={{
								songID: hit.objectID,
								...hit,
							}}
						/>
					),
					lowerLeft: (
						<FeaturingArtists
							song={hit}
						/>
					),
				}}
				imageOptions={{
					title: hit.title,
					path: determineObjectPath(
						"album",
						hit.album.albumID,
					),
					url: determineCatalogImageURL(
						hit.album.albumID,
						"cover",
						ImageSizes.MINI,
						ImageDimensions.SQUARE,
					),
				}}
			/>
		)
	} else if (isGenre(hit)) {
		return (
			<Item
				leftIcon="list"
				className={className}
				infoOptions={{
					upperLeft: (
						<ObjectLink
							link={{
								text: hit.name,
								path: determineObjectPath("genre", hit.objectID),
							}}
						/>
					),
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
								path: determineObjectPath("album", hit.objectID),
							}}
						/>
					),
					lowerLeft: (
						<ObjectLinks
							links={hit.artists.map(({ artistID, name }) => ({
								text: name,
								path: determineObjectPath("artist", artistID),
							}))}
						/>
					),
				}}
				imageOptions={{
					title: hit.title,
					path: determineObjectPath(
						"album",
						hit.objectID,
					),
					url: determineCatalogImageURL(
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
			<Item
				leftIcon="person"
				className={className}
				infoOptions={{
					upperLeft: (
						<ObjectLink
							link={{
								text: hit.name,
								path: determineObjectPath("artist", hit.objectID),
							}}
						/>
					),
				}}
				imageOptions={{
					title: hit.name,
					path: determineObjectPath(
						"artist",
						hit.objectID,
					),
					url: determineCatalogImageURL(
						hit.objectID,
						"profile",
						ImageSizes.MINI,
						ImageDimensions.SQUARE,
					),
				}}
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
								path: determineObjectPath("playlist", hit.objectID),
							}}
						/>
					),
					lowerLeft: (
						<ObjectLink
							link={{
								text: hit.user.name,
								path: determineObjectPath("user", hit.user.userID),
							}}
						/>
					),
				}}
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
	hit: Hit,
}

export default SearchHit