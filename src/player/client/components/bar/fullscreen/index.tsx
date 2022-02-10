import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, useEffect, VFC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import Modal from "../../modal"
import Progress from "../progress"
import BarControls from "../controls"
import SongTitle from "../../song-title"
import ObjectLinks from "../../object-links"
import { useKeyPress } from "../../../hooks"
import { Song, Handler } from "../../../types"
import FeaturingArtists from "../../featuring-artists"
import { createObjectPath, createCatalogImageURL } from "../../../helpers"

import "./index.scss"

const bem =
	createBEM("BarFullscreen")

interface PropTypes {
	song: Song,
	open: boolean,
	onClose: Handler,
}

const BarFullscreen: VFC<PropTypes> = ({ open, song, onClose }) => {
	const escapePress = useKeyPress("Escape")

	useEffect(() => {
		if (escapePress) {
			void onClose()
		}
	}, [escapePress])

	return (
		<Modal
			open={open}
			onClose={onClose}
			contentClassName={bem("")}
		>
			<Button
				transparent
				icon="close"
				onClick={onClose}
				title="Close Player"
				className={bem("close")}
			/>
			<div className={bem("content", "FlexColumn")}>
				<img
					alt={song.album.title}
					crossOrigin="anonymous"
					className={bem("content-cover", "Card")}
					src={createCatalogImageURL(
						song.album.albumID,
						"cover",
						ImageSizes.FULL,
						ImageDimensions.SQUARE,
					)}
				/>
				<div className="FlexColumnGapHalf">
					<h1 className={bem("content-title", "content-text")}>
						<SongTitle
							noLink
							song={song}
							onClick={onClose}
						/>
					</h1>
					<h3 className={bem("content-artists", "content-text")}>
						<FeaturingArtists
							song={song}
							onClick={onClose}
						/>
					</h3>
					<h2 className={bem("content-genres", "content-text")}>
						<ObjectLinks
							onClick={onClose}
							links={song.genres.map(({ genreID, name }) => ({
								text: name,
								path: createObjectPath("genre", genreID),
							}))}
						/>
					</h2>
				</div>
				<Progress
					duration={song.duration}
					className={bem("content-progress")}
				/>
				<BarControls
					className={bem("content-controls")}
					playButtonClassName={bem("content-controls-play")}
				/>
			</div>
		</Modal>
	)
}

export default BarFullscreen