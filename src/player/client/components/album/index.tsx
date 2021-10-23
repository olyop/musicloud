import { createBEM } from "@oly_op/bem"
import { createElement, FC, Fragment } from "react"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import Cover from "../cover"
import ObjectLink from "../object-link"
import ObjectLinks from "../object-links"
import Item, { ModalOptions } from "../item"
import { ModalButton, ModalButtons } from "../modal"
import { useShuffleAlbum, usePlayAlbum } from "../../hooks"
import { Album as AlbumType, Handler, SettingsListStyle } from "../../types"
import { determineCatalogImageURL, determineObjectPath } from "../../helpers"
import { useStateListStyle, useStatePlay, useStateShowReleased } from "../../redux"

const ModalPlayButton: FC<ModalPlayButtonPropTypes> = ({
	onClose,
	onClick,
	isPlaying,
}) => {
	const play = useStatePlay()
	const playing = play && isPlaying
	return (
		<ModalButton
			onClose={onClose}
			onClick={onClick}
			text={playing ? "Pause" : "Play"}
			icon={playing ? "pause" : "play_arrow"}
		/>
	)
}

interface ModalPlayButtonPropTypes {
	onClose: Handler,
	onClick: Handler,
	isPlaying: boolean,
}

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

	const modalOptions: ModalOptions = {
		header: {
			text: (
				<ObjectLink
					text={album.title}
					path={determineObjectPath("album", album.albumID)}
				/>
			),
			imgPropTypes: {
				title: album.title,
				url: determineCatalogImageURL(
					album.albumID,
					"cover",
					ImageSizes.MINI,
					ImageDimensions.SQUARE,
				),
			},
		},
		content: onClose => (
			<ModalButtons>
				<ModalPlayButton
					onClose={onClose}
					onClick={playAlbum}
					isPlaying={isPlaying}
				/>
				<ModalButton
					text="Playlist"
					icon="playlist_add"
					link={`/add-album-to-playlist/${removeDashesFromUUID(album.albumID)}`}
				/>
				<ModalButton
					icon="shuffle"
					text="Shuffle"
					onClick={shuffleAlbum}
				/>
			</ModalButtons>
		),
	}

	const path =
		determineObjectPath("album", album.albumID)

	return (
		listStyle === SettingsListStyle.LIST || alwaysList ? (
			<Item
				leftIcon={leftIcon ? "album" : undefined}
				modalOptions={hideModal ? undefined : modalOptions}
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
					modalOptions={hideModal ? undefined : modalOptions}
					playOptions={{
						isPlaying,
						onClick: playAlbum,
					}}
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