import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC, Fragment } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import {
	determineObjectPath,
	determineCatalogImageURL,
} from "../../../helpers"

import BarVolume from "../volume"
import Progress from "../../progress"
import BarControls from "../controls"
import SongTitle from "../../song-title"
import ObjectLink from "../../object-link"
import ObjectLinks from "../../object-links"
import { Song, Handler } from "../../../types"
import FeaturingArtists from "../../featuring-artists"

import "./index.scss"

const bem =
	createBEM("BarFullscreen")

const BarFullscreen: FC<PropTypes> = ({ nowPlaying, onExit }) => (
	<div className={bem("", "FullWidthAndHeight")}>
		<Button
			transparent
			icon="close"
			onClick={onExit}
			iconClassName={bem("button-icon")}
			className={bem("close", "button", "Padding Margin")}
		/>
		<div className={bem("main")}>
			<Image
				title={nowPlaying.album.title}
				className={bem("cover", "Card")}
				url={determineCatalogImageURL(
					nowPlaying.album.albumID,
					"cover",
					ImageSizes.FULL,
					ImageDimensions.SQUARE,
				)}
			/>
			<h1 className={bem("title", "text", "MarginBottomHalf")}>
				<SongTitle
					showRemixers
					song={nowPlaying}
				/>
			</h1>
			<h3 className={bem("artists", "text", "MarginBottomHalf")}>
				<FeaturingArtists
					onClick={onExit}
					song={nowPlaying}
				/>
			</h3>
			<h2 className={bem("album", "text", "MarginBottomHalf")}>
				<ObjectLink
					onClick={onExit}
					text={nowPlaying.album.title}
					path={determineObjectPath("album", nowPlaying.album.albumID)}
				/>
				<Fragment> - </Fragment>
				<ObjectLinks
					onClick={onExit}
					links={nowPlaying.genres.map(({ genreID, name }) => ({
						text: name,
						path: determineObjectPath("genre", genreID),
					}))}
				/>
			</h2>
			<Progress
				duration={nowPlaying.duration}
			/>
			<BarControls
				className={bem("controls")}
				buttonClassName={bem("button")}
				playButtonClassName={bem("play")}
				buttonIconClassName={bem("button-icon")}
				playButtonIconClassName={bem("play-icon")}
			/>
		</div>
		<BarVolume
			iconClassName={bem("button-icon")}
			className={bem("volume", "button", "Padding Margin")}
		/>
	</div>
)

interface PropTypes {
	onExit: Handler,
	nowPlaying: Song,
}

export default BarFullscreen