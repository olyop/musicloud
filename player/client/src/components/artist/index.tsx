import { createBEM } from "@oly_op/bem"
import { NavLink } from "react-router-dom"
import { createElement, Fragment, VFC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import Item, {
	InfoOptions,
	ImageOptions,
	InLibraryOptions,
	ModalOptionsWithFunction,
} from "../item"

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

import ObjectLink from "../object-link"
import { useStateListStyle } from "../../redux"
import { ModalButton, ModalButtons } from "../modal"
import { useToggleObjectInLibrary, useShuffleArtist } from "../../hooks"

import "./index.scss"

const bem =
	createBEM("Artist")

const Artist: VFC<PropTypes> = ({
	artist,
	className,
	showIcon = false,
	hideModal = false,
	alwaysList = false,
	hideInLibrary = false,
	hideArtistLower = false,
}) => {
	const { artistID } = artist
	const listStyle = useStateListStyle()

	const [ shuffle ] =
		useShuffleArtist({ artistID })

	const [ toggleInLibrary, inLibrary, isError ] =
		useToggleObjectInLibrary(hideInLibrary ? undefined : artist)

	const inLibraryConfig: InLibraryOptions | undefined = hideInLibrary ? undefined : {
		isError,
		inLibrary,
		onClick: toggleInLibrary,
	}

	const modalOptions: ModalOptionsWithFunction = onClose => ({
		header: {
			shareData: {
				title: artist.name,
				url: createObjectPath("artist", artist.artistID),
			},
			text: (
				<ObjectLink
					link={{
						text: artist.name,
						path: createObjectPath("artist", artist.artistID),
					}}
				/>
			),
			image: {
				description: artist.name,
				src: createCatalogImageURL(
					artist.artistID,
					"profile",
					ImageSizes.MINI,
					ImageDimensions.SQUARE,
				),
			},
		},
		content: (
			<ModalButtons>
				{hideInLibrary || (
					<ModalButton
						onClose={onClose}
						onClick={toggleInLibrary}
						icon={inLibrary ? "done" : "add"}
						text={inLibrary ? "Remove" : "Add"}
					/>
				)}
				<ModalButton
					icon="shuffle"
					text="Shuffle"
					onClick={shuffle}
					onClose={onClose}
				/>
			</ModalButtons>
		),
	})

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

	return listStyle === SettingsListStyle.LIST || alwaysList ? (
		<Item
			infoOptions={info}
			imageOptions={imageOptions}
			inLibraryOptions={inLibraryConfig}
			leftIcon={showIcon ? "person" : undefined}
			modalOptions={hideModal ? undefined : modalOptions}
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
				infoOptions={info}
				className="PaddingHalf"
				modalOptions={modalOptions}
				inLibraryOptions={inLibraryConfig}
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