import {
	ImageSizes,
	AlbumID,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { createElement, Fragment, VFC } from "react"
import { NavLink, useParams } from "react-router-dom"
import { addDashesToUUID, removeDashesFromUUID } from "@oly_op/uuid-dashes"
import deserializeDuration from "@oly_op/music-app-common/deserialize-duration"

import Disc from "./disc"
import AlbumArtist from "./artist"
import { Album } from "../../types"
import AlbumPlayButton from "./play-button"
import downloadCover from "./download-cover"
import downloadSongs from "./download-songs"
import GET_ALBUM_PAGE from "./get-album-page.gql"
import ObjectLinks from "../../components/object-links"
import { useQuery, useToggleAlbumInLibrary, useShuffleAlbum } from "../../hooks"
import { createDiscs, createObjectPath, createCatalogImageURL } from "../../helpers"

import "./index.scss"

const bem =
	createBEM("AlbumPage")

const AlbumPage: VFC = () => {
	const params = useParams<keyof AlbumID>()
	const albumID = addDashesToUUID(params.albumID!)

	const { data, error } =
		useQuery<GetAlbumData, AlbumID>(
			GET_ALBUM_PAGE,
			{ variables: { albumID } },
		)

	const [ shuffleAlbum ] =
		useShuffleAlbum({ albumID })

	const [ toggleAlbumInLibrary, inLibrary ] =
		useToggleAlbumInLibrary({ albumID })

	const handleSongsDownload =
		async () =>
			downloadSongs(data!.getAlbumByID)

	const handleCoverDownload =
		async () =>
			downloadCover(data!.getAlbumByID.albumID)

	if (error) {
		return (
			<h2 className="Content BodyOne PaddingTopBottom">
				{error.message === "Failed to fetch" ?
					error.message :
					"Album does not exist."}
			</h2>
		)
	} else if (data) {
		const discs =
			createDiscs(data.getAlbumByID.songs)
		return (
			<Metadata title={data.getAlbumByID.title}>
				<div className={bem("", "Content PaddingTopBottom")}>
					<img
						crossOrigin="anonymous"
						alt={data.getAlbumByID.title}
						className={bem("img", "Elevated")}
						src={createCatalogImageURL(
							data.getAlbumByID.albumID,
							"cover",
							ImageSizes.FULL,
							ImageDimensions.SQUARE,
						)}
					/>
					<div className={bem("content")}>
						<div className={bem("title")}>
							<h1 className="HeadingFour">
								{data.getAlbumByID.title}
							</h1>
							<AlbumPlayButton
								albumID={albumID}
							/>
						</div>
						<div className="FlexRowGapHalf MarginBottomHalf">
							{data.getAlbumByID.artists.map(
								artist => (
									<AlbumArtist
										artist={artist}
										key={artist.artistID}
									/>
								),
							)}
						</div>
						<h3 className={bem("released", "BodyOne LightColor LightWeight")}>
							{data.getAlbumByID.released}
						</h3>
						<h3 className="BodyTwo MarginBottom LightColor LightWeight">
							<ObjectLinks
								links={data.getAlbumByID.genres.map(({ genreID, name }) => ({
									text: name,
									path: createObjectPath("genre", genreID),
								}))}
							/>
						</h3>
						<div className="MarginTopHalf">
							{discs.map(
								disc => (
									<Disc
										disc={disc}
										key={disc.number}
										className="MarginBottom"
										isSingle={disc.songs.length === 1}
									/>
								),
							)}
							{discs.length > 1 && (
								<p className="BodyTwo LightColor MarginTopQuart MarginBottom">
									{discs.length > 1 && (
										<Fragment>
											{discs.length}
											<Fragment> discs, </Fragment>
										</Fragment>
									)}
									{data.getAlbumByID.songs.length}
									<Fragment> songs</Fragment>
								</p>
							)}
						</div>
						<div className={bem("buttons", "FlexRowGapHalf MarginBottom")}>
							<Button
								icon="shuffle"
								text="Shuffle"
								onClick={shuffleAlbum}
							/>
							<Button
								onClick={toggleAlbumInLibrary}
								icon={inLibrary ? "done" : "add"}
								text={inLibrary ? "Remove" : "Add"}
							/>
							<NavLink
								className={bem("buttons-link")}
								to={`/add-album-to-playlist/${removeDashesFromUUID(albumID)}`}
							>
								<Button
									text="Playlist"
									icon="playlist_add"
									className={bem("buttons-link-button")}
								/>
							</NavLink>
						</div>
						<details open={false}>
							<summary className={bem("sum", "BodyTwo MarginBottomHalf")}>
								Downloads
							</summary>
							<div className="FlexRowGapHalf MarginBottom">
								<Button
									text="Songs"
									icon="download"
									onClick={handleSongsDownload}
								/>
								<Button
									text="Cover"
									icon="download"
									onClick={handleCoverDownload}
								/>
							</div>
						</details>
						<details open={false}>
							<summary className={bem("sum", "BodyTwo MarginBottomHalf")}>
								Details
							</summary>
							<p className={bem("footer-text")}>
								<Fragment>Released: </Fragment>
								{data.getAlbumByID.released}
							</p>
							<p className={bem("footer-text")}>
								<Fragment>Duration: </Fragment>
								{deserializeDuration(data.getAlbumByID.duration, true)}
							</p>
						</details>
					</div>
				</div>
			</Metadata>
		)
	} else {
		return null
	}
}

interface GetAlbumData {
	getAlbumByID: Album,
}

export default AlbumPage