import {
	ImageSizes,
	AlbumIDBase,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import Metadata from "@oly_op/react-metadata"
import { createElement, Fragment, FC } from "react"
import { NavLink, useParams } from "react-router-dom"
import { addDashesToUUID, removeDashesFromUUID } from "@oly_op/uuid-dashes"
import deserializeDuration from "@oly_op/music-app-common/deserialize-duration"

import {
	createDiscs,
	determineObjectPath,
	determineCatalogImageURL,
} from "../../helpers"

import Disc from "./disc"
import AlbumArtist from "./artist"
import { Album } from "../../types"
import downloadCover from "./download-cover"
import downloadSongs from "./download-songs"
import GET_ALBUM_PAGE from "./get-album-page.gql"
import ObjectLinks from "../../components/object-links"
import areAllSongsInLibrary from "./are-all-songs-in-library"
import ADD_ALBUM_TO_LIBRARY from "./add-album-to-library.gql"
import { useQuery, useMutation, useShuffleAlbum } from "../../hooks"
import REMOVE_ALBUM_FROM_LIBRARY from "./remove-album-from-library.gql"

import "./index.scss"
import AlbumPlayButton from "./play-button"

const bem =
	createBEM("AlbumPage")

const AlbumPage: FC = () => {
	const params = useParams<AlbumIDBase>()
	const albumID = addDashesToUUID(params.albumID)

	const variables: AlbumIDBase =
		{ albumID }

	const [ shuffleAlbum, { loading: shuffleLoading } ] =
		useShuffleAlbum(albumID)

	const { data, error } =
		useQuery<AlbumData, AlbumIDBase>(
			GET_ALBUM_PAGE,
			{ variables },
		)

	const [ addToLibrary, { loading: addLoading } ] =
		useMutation<AddAlbumToLibraryData, AlbumIDBase>(
			ADD_ALBUM_TO_LIBRARY,
			{ variables },
		)

	const [ removeFromLibrary, { loading: removeLoading } ] =
		useMutation<RemoveAlbumFromLibraryData, AlbumIDBase>(
			REMOVE_ALBUM_FROM_LIBRARY,
			{ variables },
		)

	const handleAdd =
		async () => {
			await addToLibrary()
		}

	const handleRemove =
		async () => {
			await removeFromLibrary()
		}

	const handleSongsDownload =
		async () =>
			downloadSongs(data!.album)

	const handleCoverDownload =
		async () =>
			downloadCover(data!.album.albumID)

	const loading =
		addLoading || removeLoading || shuffleLoading

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
			createDiscs(data.album.songs)
		const songsInLibrary =
			areAllSongsInLibrary(data.album.songs)
		return (
			<Metadata title={data.album.title}>
				<div className={bem("", "Content PaddingTopBottom")}>
					<Image
						title={data.album.title}
						className={bem("img", "Elevated")}
						url={determineCatalogImageURL(
							data.album.albumID,
							"cover",
							ImageSizes.FULL,
							ImageDimensions.SQUARE,
						)}
					/>
					<div className={bem("content")}>
						<div className={bem("title")}>
							<h1 className="HeadingFour">
								{data.album.title}
							</h1>
							<AlbumPlayButton
								albumID={albumID}
							/>
						</div>
						<div className="FlexListGapHalf MarginBottomHalf">
							{data.album.artists.map(
								artist => (
									<AlbumArtist
										artist={artist}
										key={artist.artistID}
									/>
								),
							)}
						</div>
						<h3 className={bem("released", "BodyOne LightColor LightWeight")}>
							{data.album.released}
						</h3>
						<h3 className="BodyTwo MarginBottom LightColor LightWeight">
							<ObjectLinks
								links={data.album.genres.map(({ genreID, name }) => ({
									text: name,
									path: determineObjectPath("genre", genreID),
								}))}
							/>
						</h3>
						<div className={bem("discs", "MarginTopHalf")}>
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
									{data.album.songs.length}
									<Fragment> songs</Fragment>
								</p>
							)}
						</div>
						<div className="FlexListGapHalf MarginBottom">
							<Button
								icon="shuffle"
								text="Shuffle"
								onClick={loading ? undefined : shuffleAlbum}
							/>
							<Button
								icon={songsInLibrary ? "done" : "add"}
								text={songsInLibrary ? "Remove" : "Add"}
								onClick={loading ?
									undefined :
									(songsInLibrary ? handleRemove : handleAdd)}
							/>
							<NavLink to={`/add-album-to-playlist/${removeDashesFromUUID(albumID)}`}>
								<Button
									text="Playlist"
									icon="playlist_add"
								/>
							</NavLink>
						</div>
						<details open={false}>
							<summary className={bem("sum", "BodyTwo MarginBottomHalf")}>
								Downloads
							</summary>
							<div className="FlexListGapHalf MarginBottom">
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
								{data.album.released}
							</p>
							<p className={bem("footer-text")}>
								<Fragment>Duration: </Fragment>
								{deserializeDuration(data.album.duration, true)}
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

interface AlbumData {
	album: Album,
}

interface AddAlbumToLibraryData {
	addAlbumToLibrary: Album,
}
interface RemoveAlbumFromLibraryData {
	removeAlbumFromLibrary: Album,
}

export default AlbumPage