import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

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
import { ModalHeaderPropTypes, ModalButtonPropTypes } from "../modal"
import Item, { InfoOptions, ImageOptions, InLibraryOptions } from "../item"

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

	const modalHeader: ModalHeaderPropTypes = {
		text: artist.name,
		imgPropTypes: {
			title: artist.name,
			url: determineCatalogImageURL(
				artist.artistID,
				"profile",
				ImageSizes.MINI,
				ImageDimensions.SQUARE,
			),
		},
	}

	const modalButtons: ModalButtonPropTypes[] = [{
		onClick: handleToggleInLibrary,
		icon: inLibrary ? "done" : "add",
		text: inLibrary ? "Remove" : "Add",
	},{
		icon: "shuffle",
		text: "Shuffle",
		onClick: handleShuffleClick,
	}]

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
			modalHeader={modalHeader}
			imageOptions={imageOptions}
			modalButtons={modalButtons}
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
				modalHeader={modalHeader}
				modalButtons={modalButtons}
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