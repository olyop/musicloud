import {
	ImageSizes,
	AlbumIDBase,
	PlaylistIDBase,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import isEmpty from "lodash/isEmpty"
import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useState, createElement, FC } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { useHistory, useParams } from "react-router-dom"

import { Album, User } from "../../types"
import GET_ALBUM_DATA from "./get-album-data.gql"
import Playlists from "../../components/playlists"
import { useQuery, useMutation } from "../../hooks"
import ObjectLink from "../../components/object-link"
import GET_USER_PLAYLISTS from "./get-user-playlists.gql"
import ADD_ALBUM_TO_PLAYLIST from "./add-album-to-playlist.gql"
import { determineObjectPath, determineCatalogImageURL } from "../../helpers"

import "./index.scss"

interface AlbumData {
	album: Album,
}

interface PlaylistsData {
	user: User,
}

interface AddVars
	extends AlbumIDBase, PlaylistIDBase {}

const bem =
	createBEM("AddAlbumToPlaylistPage")

const AddAlbumToPlaylistPage: FC = () => {
	const history = useHistory()
	const params = useParams<AlbumIDBase>()
	const albumID = addDashesToUUID(params.albumID)

	const [ playlistID, setPlaylistID ] =
		useState<string | null>(null)

	const { data: playlistsData } =
		useQuery<PlaylistsData>(
			GET_USER_PLAYLISTS,
			{ fetchPolicy: "no-cache" },
		)

	const { data: albumData } =
		useQuery<AlbumData, AlbumIDBase>(
			GET_ALBUM_DATA,
			{ variables: { albumID } },
		)

	const [ add ] =
		useMutation<unknown, AddVars>(ADD_ALBUM_TO_PLAYLIST)

	const onClose =
		() => history.goBack()

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
			<Image
				title={albumData.album.title}
				className={bem("cover", "Card Elevated")}
				url={determineCatalogImageURL(
					albumData.album.albumID,
					"cover",
					ImageSizes.HALF,
					ImageDimensions.SQUARE,
				)}
			/>
			<h1 className="BodyOne">
				<ObjectLink
					text={albumData.album.title}
					path={determineObjectPath("album", albumData.album.albumID)}
				/>
			</h1>
			{!isEmpty(playlistsData.user.playlists) ? (
				<Playlists
					hideModal
					hideOrderBy
					hideInLibrary
					className={bem("playlists")}
					selectedClassName={bem("selected")}
					playlistClassName={bem("playlist")}
					onPlaylistClick={handlePlaylistSelect}
					playlists={playlistsData.user.playlists}
					isSelected={value => value === playlistID}
				/>
			) : (
				<p className="BodyTwo">
					No playlists to add to.
				</p>
			)}
			<div className="FlexListGapHalf">
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

export default AddAlbumToPlaylistPage