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
import { determineCatalogImageURL } from "../../helpers"

const className =
	"PaddingQuart ItemBorder"

const Hit: VFC<PropTypes> = ({ hit }) => {
	if (isUser(hit)) {
		return (
			<Item
				leftIcon="person"
				className={className}
				infoOptions={{ upperLeft: hit.name }}
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
				infoOptions={{ upperLeft: hit.title }}
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
				infoOptions={{ upperLeft: hit.name }}
			/>
		)
	} else if (isAlbum(hit)) {
		return (
			<Item
				leftIcon="album"
				className={className}
				infoOptions={{ upperLeft: hit.title }}
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
					upperLeft: hit.name,
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