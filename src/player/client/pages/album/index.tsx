import {
	AlbumID,
	ImageSizes,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { Link, useParams } from "react-router-dom"
import { createElement, Fragment, VFC } from "react"
import { addDashesToUUID, removeDashesFromUUID } from "@oly_op/uuid-dashes"

import Disc from "./disc"
import AlbumArtist from "./artist"
import { Album } from "../../types"
import createDiscs from "./create-discs"
import AlbumPlayButton from "./play-button"
import Buttons from "../../components/buttons"
import GET_ALBUM_PAGE from "./get-album-page.gql"
import AlbumTitle from "../../components/album-title"
import ObjectLinks from "../../components/object-links"
import { createObjectPath, createCatalogImageURL, determinePlural } from "../../helpers"
import { useQuery, useToggleAlbumInLibrary, useShuffleAlbum } from "../../hooks"

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

		const handleShare =
			() =>
				navigator.share({
					title: data?.getAlbumByID.title,
					url: createObjectPath("album", albumID),
				})

		return (
			<Metadata title={data.getAlbumByID.title}>
				<div className={bem("", "Content PaddingTopBottom")}>
					<img
						crossOrigin="anonymous"
						alt={data.getAlbumByID.title}
						className={bem("cover", "content", "Elevated")}
						src={createCatalogImageURL(
							data.getAlbumByID.albumID,
							"cover",
							ImageSizes.FULL,
							ImageDimensions.SQUARE,
						)}
					/>
					<div className={bem("content", "FlexColumnGap")}>
						<div>
							<div className={bem("title", "MarginBottomHalf")}>
								<h1 className="HeadingFour">
									<AlbumTitle
										hideReleased
										album={data.getAlbumByID}
									/>
								</h1>
								<AlbumPlayButton
									albumID={albumID}
								/>
							</div>
							<div className="FlexRowGapHalf MarginBottomThreeQuart">
								{data.getAlbumByID.artists.map(
									artist => (
										<AlbumArtist
											artist={artist}
											key={artist.artistID}
										/>
									),
								)}
							</div>
							<h3 className="BodyOne LightColor MarginBottomHalf LightWeight">
								{data.getAlbumByID.released}
							</h3>
							<h3 className="BodyTwo LightColor LightWeight">
								<ObjectLinks
									links={data.getAlbumByID.genres.map(({ genreID, name }) => ({
										text: name,
										path: createObjectPath("genre", genreID),
									}))}
								/>
							</h3>
						</div>
						{discs.map(
							disc => (
								<Disc
									disc={disc}
									key={disc.number}
									isSingle={disc.songs.length === 1}
								/>
							),
						)}
						<Buttons>
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
							<Link
								className={bem("buttons-link")}
								to={`/add-album-to-playlist/${removeDashesFromUUID(albumID)}`}
							>
								<Button
									text="Playlist"
									icon="playlist_add"
									className={bem("buttons-link-button")}
								/>
							</Link>
							<Button
								icon="share"
								text="Share"
								onClick={handleShare}
							/>
						</Buttons>
						<p className="BodyTwo LightColor">
							{discs.length > 1 && (
								<Fragment>
									{discs.length}
									<Fragment> discs, </Fragment>
								</Fragment>
							)}
							{data.getAlbumByID.songs.length}
							<Fragment> song</Fragment>
							{determinePlural(data.getAlbumByID.songs.length)}
							<Fragment>, </Fragment>
							{Math.floor(data.getAlbumByID.duration / 60)}
							<Fragment> minutes, </Fragment>
							{Math.floor(data.getAlbumByID.duration % 60)}
							<Fragment> seconds</Fragment>
						</p>
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