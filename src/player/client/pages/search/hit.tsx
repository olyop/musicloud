import { createElement, VFC, Fragment } from "react"
import { AlgoliaRecord, ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import {
	isUser,
	isSong,
	isAlbum,
	isGenre,
	isArtist,
	isPlaylist,
} from "./is-object"

import Item from "../../components/item"
import SongTitle from "../../components/song-title"
import ObjectLink from "../../components/object-link"
import ObjectLinks from "../../components/object-links"
import FeaturingArtists from "../../components/featuring-artists"
import { determineCatalogImageURL, determineObjectPath } from "../../helpers"

const className =
	"PaddingQuart ItemBorder"

const Hit: VFC<PropTypes> = ({ hit }) => {
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
					upperLeft: hit.title,
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
	hit: AlgoliaRecord,
}

export default Hit