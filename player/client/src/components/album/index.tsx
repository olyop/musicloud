import { Link } from "react-router-dom"
import { createBEM } from "@oly_op/bem"
import { createElement, FC, Fragment } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import AlbumModal from "./modal"
import AlbumTitle from "../album-title"
import ObjectLinks from "../object-links"
import Item, { ItemModal } from "../item"
import { usePlayAlbum } from "../../hooks"
import { useStateListStyle, useStateShowReleased } from "../../redux"
import { createCatalogImageURL, createObjectPath } from "../../helpers"
import { ObjectShowIcon, SettingsListStyle, Album as AlbumType } from "../../types"

import "./index.scss"

const bem =
	createBEM("Album")

const Album: FC<PropTypes> = ({
	album,
	className,
	showIcon = false,
	hidePlay = false,
	hideModal = false,
	alwaysList = false,
	hideReleased = false,
	hideInLibrary = false,
}) => {
	const { albumID } = album
	const listStyle = useStateListStyle()
	const showReleased = useStateShowReleased()

	const [ playAlbum, isPlaying ] =
		usePlayAlbum({ albumID })

	const path =
		createObjectPath("album", album.albumID)

	const modal: ItemModal = ({ open, onClose }) => (
		<AlbumModal
			open={open}
			album={album}
			onClose={onClose}
			hideInLibrary={hideInLibrary}
		/>
	)

	return (
		alwaysList || listStyle === SettingsListStyle.LIST ? (
			<Item
				modal={hideModal ? undefined : modal}
				leftIcon={showIcon ? "album" : undefined}
				className={bem(className, "PaddingHalf ItemBorder")}
				playOptions={hidePlay ? undefined : {
					isPlaying,
					onClick: playAlbum,
				}}
				imageOptions={{
					path,
					title: album.title,
					url: createCatalogImageURL(
						album.albumID,
						"cover",
						ImageSizes.MINI,
						ImageDimensions.SQUARE,
					),
				}}
				infoOptions={{
					upperLeft: (
						<AlbumTitle
							hideReleased
							album={album}
						/>
					),
					lowerLeft: (
						<ObjectLinks
							links={album.artists.map(({ artistID, name }) => ({
								text: name,
								path: createObjectPath("artist", artistID),
							}))}
						/>
					),
					rightRight: (
						hideReleased || !showReleased ?
							undefined : album.released
					),
				}}
			/>
		) : (
			<div className={bem(className, "Card")}>
				<Link
					to={path}
					title={album.title}
					className={bem("cover")}
					children={(
						<Fragment>
							<div
								className={bem("cover-black", "FullWidthAndHeight")}
							/>
							<img
								alt={album.title}
								crossOrigin="anonymous"
								className={bem("cover-image", "FullWidthAndHeight")}
								src={createCatalogImageURL(
									album.albumID,
									"cover",
									ImageSizes.HALF,
									ImageDimensions.SQUARE,
								)}
							/>
						</Fragment>
					)}
				/>
				<Item
					className="PaddingHalf"
					modal={hideModal ? undefined : modal}
					playOptions={{
						isPlaying,
						onClick: playAlbum,
					}}
					infoOptions={{
						upperLeft: (
							<AlbumTitle
								album={album}
							/>
						),
						lowerLeft: (
							<ObjectLinks
								links={album.artists.map(({ artistID, name }) => ({
									text: name,
									path: createObjectPath("artist", artistID),
								}))}
							/>
						),
					}}
				/>
			</div>
		)
	)
}

interface PropTypes extends ObjectShowIcon {
	album: AlbumType,
	hidePlay?: boolean,
	className?: string,
	hideModal?: boolean,
	alwaysList?: boolean,
	hideReleased?: boolean,
	hideInLibrary?: boolean,
}

export default Album