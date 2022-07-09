import {
	AlbumID,
	ImageSizes,
	ImageDimensions,
} from "@oly_op/musicloud-common"

import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { Link, useParams } from "react-router-dom"
import { createElement, Fragment, FC } from "react"
import { addDashesToUUID, removeDashesFromUUID } from "@oly_op/uuid-dashes"

import Disc from "./disc"
import AlbumArtist from "./artist"
import { Album } from "../../types"
import Page from "../../components/page"
import createDiscs from "./create-discs"
import AlbumPlayButton from "./play-button"
import Buttons from "../../components/buttons"
import Content from "../../components/content"
import AlbumTitle from "../../components/album-title"
import ObjectLinks from "../../components/object-links"
import { useQuery, useToggleAlbumInLibrary, useShuffleAlbum } from "../../hooks"
import { createObjectPath, createCatalogImageURL, determinePlural } from "../../helpers"

import GET_ALBUM_PAGE from "./get-album-page.gql"

import "./index.scss"

const bem =
	createBEM("AlbumPage")

const AlbumPage: FC = () => {
	const params = useParams<keyof AlbumID>()
	const albumID = addDashesToUUID(params.albumID!)

	const { data, error } =
		useQuery<GetAlbumData, AlbumID>(
			GET_ALBUM_PAGE,
			{ variables: { albumID } },
		)

	const [ shuffleAlbum ] =
		useShuffleAlbum({ albumID })

	const [ toggleInLibrary, inLibrary ] =
		useToggleAlbumInLibrary({ albumID })

	if (error) {
		return (
			<Head pageTitle={null}>
				<Page>
					<Content>
						<h2 className="BodyOne">
							{error.message === "Failed to fetch" ?
								error.message :
								"Album does not exist."}
						</h2>
					</Content>
				</Page>
			</Head>
		)
	} else if (data) {
		const album = data.getAlbumByID
		const { title, songs, duration, artists, genres, released } = album

		const discs =
			createDiscs(songs)

		const handleShare =
			() => {
				if ("share" in navigator) {
					void navigator.share({
						title,
						url: createObjectPath("album", albumID),
					})
				}
			}

		return (
			<Head pageTitle={title}>
				<Page>
					<Content className={bem("")}>
						<img
							alt={title}
							crossOrigin="anonymous"
							className={bem("cover", "content", "Elevated")}
							src={createCatalogImageURL(
								albumID,
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
											album={album}
										/>
									</h1>
									<AlbumPlayButton
										albumID={albumID}
									/>
								</div>
								<div className="FlexRowGapHalf MarginBottomThreeQuart">
									{artists.map(
										artist => (
											<AlbumArtist
												artist={artist}
												key={artist.artistID}
											/>
										),
									)}
								</div>
								<h3 className="BodyOne LightColor MarginBottomHalf LightWeight">
									{released}
								</h3>
								<h3 className="BodyTwo LightColor LightWeight">
									<ObjectLinks
										links={genres.map(({ genreID, name }) => ({
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
										key={disc.index}
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
									onClick={toggleInLibrary}
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
								{songs.length}
								<Fragment> song</Fragment>
								{determinePlural(songs.length)}
								<Fragment>, </Fragment>
								{Math.floor(duration / 60)}
								<Fragment> minutes, </Fragment>
								{Math.floor(duration % 60)}
								<Fragment> seconds</Fragment>
							</p>
						</div>
					</Content>
				</Page>
			</Head>
		)
	} else {
		return <Page/>
	}
}

interface GetAlbumData {
	getAlbumByID: Album,
}

export default AlbumPage