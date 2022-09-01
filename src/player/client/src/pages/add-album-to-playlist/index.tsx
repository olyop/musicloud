import {
	AlbumID,
	ImageSizes,
	PlaylistID,
	ImageDimensions,
} from "@oly_op/musicloud-common/build/types"

import isEmpty from "lodash-es/isEmpty"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { useParams, useNavigate } from "react-router-dom"
import { useState, createElement, FC, useEffect } from "react"

import { Album, User } from "../../types"
import Playlist from "../../components/playlist"
import Playlists from "../../components/playlists"
import { useQuery, useMutation } from "../../hooks"
import ObjectLink from "../../components/object-link"
import { createObjectPath, createCatalogImageURL } from "../../helpers"

import GET_ALBUM_DATA from "./get-album-data.gql"
import ADD_ALBUM_TO_PLAYLIST from "./add-album-to-playlist.gql"
import GET_USER_PLAYLISTS from "./get-user-playlists-filtered-by-album.gql"

import "./index.scss"

const bem =
	createBEM("AddAlbumToPlaylistPage")

const AddAlbumToPlaylistPage: FC = () => {
	const navigate = useNavigate()
	const params = useParams<keyof AlbumID>()
	const albumID = addDashesToUUID(params.albumID!)

	const [ playlistID, setPlaylistID ] =
		useState<string | null>(null)

	const { data: playlistsData } =
		useQuery<GetUserPlaylistsData, AlbumID>(
			GET_USER_PLAYLISTS,
			{ fetchPolicy: "no-cache", variables: { albumID } },
		)

	const { data: albumData } =
		useQuery<GetAlbumData, AlbumID>(
			GET_ALBUM_DATA,
			{ variables: { albumID } },
		)

	const [ add, { data } ] =
		useMutation<AddAlbumToPlaylistData, AddAlbumToPlaylistVars>(
			ADD_ALBUM_TO_PLAYLIST,
		)

	const handleClose =
		() => navigate(-1)

	const handleAdd =
		() => {
			if (playlistID) {
				void add({ variables: { albumID, playlistID } })
			}
		}

	const handlePlaylistSelect =
		(value: string) =>
			() => setPlaylistID(value === playlistID ? null : value)

	useEffect(() => {
		if (data) {
			handleClose()
		}
	}, [data])

	return albumData && playlistsData ? (
		<div className={bem("", "ContentPaddingTopBottom")}>
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
			<h1 className="ParagraphOne">
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
			{isEmpty(playlistsData.getUser.playlists) ? (
				<p className="ParagraphTwo">
					No playlists to add to.
				</p>
			) : (
				<Playlists className={bem("playlists")} playlists={playlistsData.getUser.playlists}>
					{playlists => playlists.map(
						playlist => (
							<Playlist
								hideModal
								hidePlays
								hideInLibrary
								playlist={playlist}
								key={playlist.playlistID}
								onClick={handlePlaylistSelect(playlist.playlistID)}
								className={bem("playlist", playlist.playlistID === playlistID && "selected")}
							/>
						),
					)}
				</Playlists>
			)}
			<div className="FlexRowGapHalf">
				<Button
					text="Back"
					icon="arrow_back"
					onClick={handleClose}
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