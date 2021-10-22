import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import { createElement, FC, Fragment } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import {
	determineObjectPath,
	determineCatalogImageURL,
} from "../../../helpers"

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
	<div className={bem("")}>
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
			buttonIconClassName={bem("button-icon")}
		/>
	</div>
)

interface PropTypes {
	onExit: Handler,
	nowPlaying: Song,
}

export default BarFullscreen