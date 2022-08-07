import isNull from "lodash-es/isNull"
import { Link } from "react-router-dom"
import { createBEM } from "@oly_op/bem"
import { createElement, forwardRef, Fragment } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types"

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

const Album = forwardRef<HTMLDivElement, PropTypes>((propTypes, ref) => {
	const {
		album,
		className,
		showIcon = false,
		hidePlay = false,
		hideModal = false,
		alwaysList = false,
		hideReleased = false,
		hideInLibrary = false,
	} = propTypes

	const isAlbumNull =
		isNull(album)

	const listStyle = useStateListStyle()
	const showReleased = useStateShowReleased()

	const [ playAlbum, isPlaying ] =
		usePlayAlbum(album && { albumID: album.albumID })

	const modal: ItemModal | undefined =
		isAlbumNull ?
			undefined :
			({ open, onClose }) => (
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
				ref={ref}
				modal={hideModal ? undefined : modal}
				leftIcon={showIcon ? "album" : undefined}
				className={bem(className, "PaddingHalf ItemBorder")}
				playOptions={(
					isAlbumNull || hidePlay ? undefined : {
						isPlaying,
						onClick: playAlbum,
					}
				)}
				imageOptions={(
					isAlbumNull ? undefined : {
						path: createObjectPath("album", album.albumID),
						title: album.title,
						url: createCatalogImageURL(
							album.albumID,
							"cover",
							ImageSizes.MINI,
							ImageDimensions.SQUARE,
						),
					}
				)}
				infoOptions={(
					isAlbumNull ? undefined : {
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
					}
				)}
			/>
		) : (
			<div ref={ref} className={bem(className, "Card")}>
				{isAlbumNull || (
					<Fragment>
						<Link
							title={album.title}
							className={bem("cover")}
							to={createObjectPath("album", album.albumID)}
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
					</Fragment>
				)}
			</div>
		)
	)
})

interface PropTypes extends ObjectShowIcon {
	hidePlay?: boolean,
	className?: string,
	hideModal?: boolean,
	alwaysList?: boolean,
	hideReleased?: boolean,
	album: AlbumType | null,
	hideInLibrary?: boolean,
}

export default Album