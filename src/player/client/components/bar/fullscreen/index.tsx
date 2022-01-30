import { createBEM } from "@oly_op/bem"
import { createElement, Fragment, useEffect, VFC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import Progress from "../../progress"
import BarControls from "../controls"
import SongTitle from "../../song-title"
import ObjectLink from "../../object-link"
import ObjectLinks from "../../object-links"
import { useKeyPress } from "../../../hooks"
import { Song, Handler } from "../../../types"
import FeaturingArtists from "../../featuring-artists"
import { createObjectPath, createCatalogImageURL } from "../../../helpers"

import "./index.scss"

const bem =
	createBEM("BarFullscreen")

const BarFullscreen: VFC<PropTypes> = ({ song, onExit }) => {
	const escapePress = useKeyPress("Escape")
	useEffect(() => {
		if (escapePress) {
			void onExit()
		}
	}, [escapePress])
	return (
		<div className={bem("")}>
			<img
				alt={song.album.title}
				crossOrigin="anonymous"
				className={bem("cover", "Card")}
				src={createCatalogImageURL(
					song.album.albumID,
					"cover",
					ImageSizes.FULL,
					ImageDimensions.SQUARE,
				)}
			/>
			<h1 className={bem("title", "text", "MarginBottomHalf")}>
				<SongTitle
					song={song}
					showRemixers
					onClick={onExit}
				/>
			</h1>
			<h3 className={bem("artists", "text", "MarginBottomHalf")}>
				<FeaturingArtists
					song={song}
					onClick={onExit}
				/>
			</h3>
			<h2 className={bem("album", "text", "MarginBottomHalf")}>
				<ObjectLink
					onClick={onExit}
					link={{
						text: song.album.title,
						path: createObjectPath("album", song.album.albumID),
					}}
				/>
				<Fragment> - </Fragment>
				<ObjectLinks
					onClick={onExit}
					links={song.genres.map(({ genreID, name }) => ({
						text: name,
						path: createObjectPath("genre", genreID),
					}))}
				/>
			</h2>
			<Progress
				duration={song.duration}
			/>
			<BarControls
				className={bem("controls")}
				buttonClassName={bem("button")}
				buttonIconClassName={bem("button-icon")}
			/>
		</div>
	)
}

interface PropTypes {
	song: Song,
	onExit: Handler,
}

export default BarFullscreen