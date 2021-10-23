import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import Item, {
	InfoOptions,
	ImageOptions,
	ModalOptions,
	InLibraryOptions,
} from "../item"

import {
	determineObjectPath,
	determineArtistLower,
	determineCatalogImageURL,
} from "../../helpers"

import Cover from "../cover"
import ObjectLink from "../object-link"
import { useStateListStyle } from "../../redux"
import { useToggleInLibrary, useShuffleArtist } from "../../hooks"
import { Artist as ArtistType, SettingsListStyle } from "../../types"
import { ModalButton, ModalButtons } from "../modal"

const bem =
	createBEM("Artist")

const Artist: FC<PropTypes> = ({
	artist,
	className,
	leftIcon = false,
	alwaysList = false,
}) => {
	const listStyle = useStateListStyle()
	const [ shuffle ] = useShuffleArtist(artist.artistID)
	const [ toggleInLibrary, inLibrary ] = useToggleInLibrary(artist)

	const handleShuffleClick =
		async () => { await shuffle() }

	const handleToggleInLibrary =
		async () => { await toggleInLibrary() }

	const inLibraryConfig: InLibraryOptions = {
		inLibrary,
		onClick: handleToggleInLibrary,
	}

	const modalOptions: ModalOptions = {
		header: {
			text: (
				<ObjectLink
					text={artist.name}
					path={determineObjectPath("artist", artist.artistID)}
				/>
			),
			imgPropTypes: {
				title: artist.name,
				url: determineCatalogImageURL(
					artist.artistID,
					"profile",
					ImageSizes.MINI,
					ImageDimensions.SQUARE,
				),
			},
		},
		content: onClose => (
			<ModalButtons>
				<ModalButton
					onClick={handleToggleInLibrary}
					icon={inLibrary ? "done" : "add"}
					text={inLibrary ? "Remove" : "Add"}
				/>
				<ModalButton
					icon="shuffle"
					text="Shuffle"
					onClick={handleShuffleClick}
				/>
			</ModalButtons>
		),
	}

	const info: InfoOptions = {
		lowerLeft: determineArtistLower(artist),
		upperLeft: (
			<ObjectLink
				text={artist.name}
				path={determineObjectPath("artist", artist.artistID)}
			/>
		),
	}

	const imageOptions: ImageOptions = {
		title: artist.name,
		path: determineObjectPath("artist", artist.artistID),
		url: determineCatalogImageURL(
			artist.artistID,
			"profile",
			ImageSizes.MINI,
			ImageDimensions.SQUARE,
		),
	}

	return listStyle === SettingsListStyle.LIST || alwaysList ? (
		<Item
			infoOptions={info}
			modalOptions={modalOptions}
			imageOptions={imageOptions}
			inLibraryOptions={inLibraryConfig}
			leftIcon={leftIcon ? "person" : undefined}
			className={bem(className, "PaddingHalf ItemBorder")}
			playOptions={{ isPlaying: false, onClick: () => {} }}
		/>
	) : (
		<div className={bem(className, "Card Elevated")}>
			<Cover
				landscape
				title={artist.name}
				link={determineObjectPath("artist", artist.artistID)}
				url={determineCatalogImageURL(
					artist.artistID,
					"cover",
					ImageSizes.HALF,
					ImageDimensions.LANDSCAPE,
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

interface PropTypes {
	artist: ArtistType,
	leftIcon?: boolean,
	className?: string,
	alwaysList?: boolean,
}

export default Artist