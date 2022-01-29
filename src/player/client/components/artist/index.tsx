import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import Item, {
	InfoOptions,
	ImageOptions,
	ModalOptions,
	InLibraryOptions,
} from "../item"

import {
	createObjectPath,
	createArtistLower,
	createCatalogImageURL,
} from "../../helpers"

import Cover from "../cover"
import ObjectLink from "../object-link"
import { useStateListStyle } from "../../redux"
import { ModalButton, ModalButtons } from "../modal"
import { Artist as ArtistType, SettingsListStyle } from "../../types"
import { useToggleObjectInLibrary, useShuffleArtist } from "../../hooks"

const bem =
	createBEM("Artist")

const Artist: VFC<PropTypes> = ({
	artist,
	className,
	leftIcon = false,
	hideModal = false,
	alwaysList = false,
}) => {
	const { artistID } = artist
	const listStyle = useStateListStyle()

	const [ shuffle ] =
		useShuffleArtist({ artistID })

	const [ toggleInLibrary, inLibrary ] =
		useToggleObjectInLibrary(artist)

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
					link={{
						text: artist.name,
						path: createObjectPath("artist", artist.artistID),
					}}
				/>
			),
			imgPropTypes: {
				title: artist.name,
				url: createCatalogImageURL(
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
					onClose={onClose}
					onClick={handleToggleInLibrary}
					icon={inLibrary ? "done" : "add"}
					text={inLibrary ? "Remove" : "Add"}
				/>
				<ModalButton
					icon="shuffle"
					text="Shuffle"
					onClose={onClose}
					onClick={handleShuffleClick}
				/>
			</ModalButtons>
		),
	}

	const info: InfoOptions = {
		lowerLeft: createArtistLower(artist),
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
			leftIcon={leftIcon ? "person" : undefined}
			modalOptions={hideModal ? undefined : modalOptions}
			className={bem(className, "PaddingHalf ItemBorder")}
			playOptions={{ isPlaying: false, onClick: () => {} }}
		/>
	) : (
		<div className={bem(className, "Card Elevated")}>
			<Cover
				landscape
				title={artist.name}
				link={createObjectPath(
					"artist",
					artist.artistID,
				)}
				url={createCatalogImageURL(
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
	hideModal?: boolean,
	alwaysList?: boolean,
}

export default Artist