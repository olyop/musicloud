import { createBEM } from "@oly_op/bem"
import { NavLink } from "react-router-dom"
import { createElement, Fragment, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import {
	ObjectShowIcon,
	SettingsListStyle,
	Artist as ArtistType,
} from "../../types"

import {
	createObjectPath,
	createArtistLower,
	createCatalogImageURL,
} from "../../helpers"

import Modal from "./modal"
import ObjectLink from "../object-link"
import { useStateListStyle } from "../../redux"
import Item, { ItemModal, InfoOptions, ImageOptions } from "../item"

import "./index.scss"

const bem =
	createBEM("Artist")

const Artist: FC<PropTypes> = ({
	artist,
	className,
	showIcon = false,
	hideModal = false,
	alwaysList = false,
	hideInLibrary = false,
	hideArtistLower = false,
}) => {
	const listStyle = useStateListStyle()

	const info: InfoOptions = {
		lowerLeft: hideArtistLower ? undefined : createArtistLower(artist),
		upperLeft: (
			<ObjectLink
				link={{
					text: artist.name,
					path: createObjectPath("artist", artist.artistID),
				}}
			/>
		),
	}

	const imageOptions: ImageOptions = {
		title: artist.name,
		path: createObjectPath(
			"artist",
			artist.artistID,
		),
		url: createCatalogImageURL(
			artist.artistID,
			"profile",
			ImageSizes.MINI,
			ImageDimensions.SQUARE,
		),
	}

	const modal: ItemModal = ({ open, onClose }) => hideModal || (
		<Modal
			open={open}
			artist={artist}
			onClose={onClose}
			hideInLibrary={hideInLibrary}
		/>
	)

	return listStyle === SettingsListStyle.LIST || alwaysList ? (
		<Item
			modal={modal}
			infoOptions={info}
			imageOptions={imageOptions}
			leftIcon={showIcon ? "person" : undefined}
			className={bem(className, "PaddingHalf ItemBorder")}
		/>
	) : (
		<div className={bem(className, "Card Elevated")}>
			<NavLink
				title={artist.name}
				className={bem("cover")}
				to={createObjectPath("artist", artist.artistID)}
				children={(
					<Fragment>
						<div
							className={bem("cover-black", "FullWidthAndHeight")}
						/>
						<img
							alt={artist.name}
							crossOrigin="anonymous"
							className={bem("cover-image", "FullWidthAndHeight")}
							src={createCatalogImageURL(
								artist.artistID,
								"cover",
								ImageSizes.HALF,
								ImageDimensions.LANDSCAPE,
							)}
						/>
					</Fragment>
				)}
			/>
			<Item
				modal={modal}
				infoOptions={info}
				className="PaddingHalf"
			/>
		</div>
	)
}

interface PropTypes extends ObjectShowIcon {
	artist: ArtistType,
	className?: string,
	hideModal?: boolean,
	alwaysList?: boolean,
	hideInLibrary?: boolean,
	hideArtistLower?: boolean,
}

export default Artist