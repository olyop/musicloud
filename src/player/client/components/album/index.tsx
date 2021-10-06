import { createBEM } from "@oly_op/bem"
import { createElement, FC, Fragment } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import Item from "../item"
import Cover from "../cover"
import ObjectLink from "../object-link"
import ObjectLinks from "../object-links"
import { useShuffleAlbum, usePlayAlbum } from "../../hooks"
import { Album as AlbumType, SettingsListStyle } from "../../types"
import { useStateListStyle, useStateShowReleased } from "../../redux"
import { ModalHeaderPropTypes, ModalButtonPropTypes } from "../modal"
import { determineCatalogImageURL, determineObjectPath } from "../../helpers"

const bem =
	createBEM("Album")

const Album: FC<PropTypes> = ({
	album,
	className,
	leftIcon = false,
	hidePlay = false,
	hideModal = false,
	alwaysList = false,
	hideReleased = false,
}) => {
	const listStyle = useStateListStyle()
	const showReleased = useStateShowReleased()

	const [ shuffleAlbum ] =
		useShuffleAlbum(album.albumID)

	const [ playAlbum, isPlaying ] =
		usePlayAlbum(album.albumID)

	const modalHeader: ModalHeaderPropTypes = {
		text: album.title,
		imgPropTypes: {
			title: album.title,
			url: determineCatalogImageURL(
				album.albumID,
				"cover",
				ImageSizes.MINI,
				ImageDimensions.SQUARE,
			),
		},
	}

	const modalButtons: ModalButtonPropTypes[] = [{
		onClick: playAlbum,
		text: isPlaying ? "Pause" : "Play",
		icon: isPlaying ? "pause" : "play_arrow",
	},{
		icon: "info",
		text: "Info",
		link: determineObjectPath("album", album.albumID),
	},{
		icon: "shuffle",
		text: "Shuffle",
		onClick: shuffleAlbum,
	}]

	const path =
		determineObjectPath("album", album.albumID)

	return (
		listStyle === SettingsListStyle.LIST || alwaysList ? (
			<Item
				leftIcon={leftIcon ? "album" : undefined}
				modalHeader={hideModal ? undefined : modalHeader}
				modalButtons={hideModal ? undefined : modalButtons}
				className={bem(className, "PaddingHalf ItemBorder")}
				playOptions={hidePlay ? undefined : {
					isPlaying,
					onClick: playAlbum,
				}}
				imageOptions={{
					path,
					title: album.title,
					url: determineCatalogImageURL(
						album.albumID,
						"cover",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					),
				}}
				infoOptions={{
					upperLeft: (
						<ObjectLink
							path={path}
							text={album.title}
						/>
					),
					lowerLeft: (
						<ObjectLinks
							links={album.artists.map(({ artistID, name }) => ({
								text: name,
								path: `${determineObjectPath("artist", artistID)}`,
							}))}
						/>
					),
					rightRight: hideReleased || !showReleased ? undefined : album.released,
				}}
			/>
		) : (
			<div className={bem(className, "Card")}>
				<Cover
					link={path}
					title={album.title}
					url={determineCatalogImageURL(
						album.albumID,
						"cover",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					)}
				/>
				<Item
					className="PaddingHalf"
					modalHeader={hideModal ? undefined : modalHeader}
					modalButtons={hideModal ? undefined : modalButtons}
					infoOptions={{
						upperLeft: (
							<Fragment>
								<ObjectLink
									path={path}
									text={album.title}
								/>
								{showReleased && (
									<span
										className="LightWeight LightColor"
										title={`${album.title} was released in ${album.released.slice(0, 4)}`}
									>
										<Fragment> (</Fragment>
										{album.released.slice(0, 4)}
										<Fragment>)</Fragment>
									</span>
								)}
							</Fragment>
						),
						lowerLeft: (
							<ObjectLinks
								links={album.artists.map(({ artistID, name }) => ({
									text: name,
									path: `${determineObjectPath("artist", artistID)}`,
								}))}
							/>
						),
					}}
					playOptions={{
						isPlaying,
						onClick: playAlbum,
					}}
				/>
			</div>
		)
	)
}

interface PropTypes {
	album: AlbumType,
	leftIcon?: boolean,
	hidePlay?: boolean,
	className?: string,
	hideModal?: boolean,
	alwaysList?: boolean,
	hideReleased?: boolean,
}

export default Album