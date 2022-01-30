import {
	AlbumID,
	ImageSizes,
	PlaylistID,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import { isEmpty } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useState, createElement, VFC } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { useParams, useNavigate } from "react-router-dom"

import { Album, User } from "../../types"
import GET_ALBUM_DATA from "./get-album-data.gql"
import Playlists from "../../components/playlists"
import { useQuery, useMutation } from "../../hooks"
import ObjectLink from "../../components/object-link"
import GET_USER_PLAYLISTS from "./get-user-playlists.gql"
import ADD_ALBUM_TO_PLAYLIST from "./add-album-to-playlist.gql"
import { createObjectPath, createCatalogImageURL } from "../../helpers"

import "./index.scss"

const bem =
	createBEM("AddAlbumToPlaylistPage")

const AddAlbumToPlaylistPage: VFC = () => {
	const navigate = useNavigate()
	const params = useParams<keyof AlbumID>()
	const albumID = addDashesToUUID(params.albumID!)

	const [ playlistID, setPlaylistID ] =
		useState<string | null>(null)

	const { data: playlistsData } =
		useQuery<GetUserPlaylistsData>(
			GET_USER_PLAYLISTS,
			{ fetchPolicy: "no-cache" },
		)

	const { data: albumData } =
		useQuery<GetAlbumData, AlbumID>(
			GET_ALBUM_DATA,
			{ variables: { albumID } },
		)

	const [ add ] =
		useMutation<AddAlbumToPlaylistData, AddAlbumToPlaylistVars>(ADD_ALBUM_TO_PLAYLIST)

	const onClose =
		() => navigate(-1)

	const handleAdd =
		async () => {
			if (playlistID) {
				await add({ variables: { albumID, playlistID } })
				onClose()
			}
		}

	const handlePlaylistSelect =
		(value: string) =>
			setPlaylistID(value === playlistID ? null : value)

	return albumData && playlistsData ? (
		<div className={bem("", "Content PaddingTopBottom")}>
			<img
				crossOrigin="anonymous"
				alt={albumData.getAlbumByID.title}
				className={bem("cover", "Card Elevated")}
				src={createCatalogImageURL(
					albumData.getAlbumByID.albumID,
					"cover",
					ImageSizes.HALF,
					ImageDimensions.SQUARE,
				)}
			/>
			<h1 className="BodyOne">
				<ObjectLink
					link={{
						text: albumData.getAlbumByID.title,
						path: createObjectPath(
							"album",
							albumData.getAlbumByID.albumID,
						),
					}}
				/>
			</h1>
			{!isEmpty(playlistsData.getUser.playlists) ? (
				<Playlists
					hideModal
					hideInLibrary
					orderBy={false}
					className={bem("playlists")}
					selectedClassName={bem("selected")}
					playlistClassName={bem("playlist")}
					onPlaylistClick={handlePlaylistSelect}
					isSelected={value => value === playlistID}
					playlists={playlistsData.getUser.playlists}
				/>
			) : (
				<p className="BodyTwo">
					No playlists to add to.
				</p>
			)}
			<div className="FlexRowGapHalf">
				<Button
					text="Back"
					icon="arrow_back"
					onClick={onClose}
				/>
				<Button
					icon="add"
					text="Add"
					onClick={handleAdd}
				/>
			</div>
		</div>
	) : null
}

interface GetAlbumData {
	getAlbumByID: Album,
}

interface GetUserPlaylistsData {
	getUser: User,
}

interface AddAlbumToPlaylistData {
	addAlbumToPlaylist: PlaylistID,
}

interface AddAlbumToPlaylistVars
	extends AlbumID, PlaylistID {}

export default AddAlbumToPlaylistPage