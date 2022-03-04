import {
	SongID,
	ImageSizes,
	PlaylistID,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import { isEmpty } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { useNavigate, useParams } from "react-router-dom"
import { useState, createElement, VFC, Fragment } from "react"

import GET_SONG_DATA from "./get-song-data.gql"
import Playlists from "../../components/playlists"
import { User, Song, Playlist } from "../../types"
import SongTitle from "../../components/song-title"
import { useQuery, useMutation } from "../../hooks"
import { createCatalogImageURL } from "../../helpers"
import ADD_SONG_TO_PLAYLIST from "./add-song-to-playlist.gql"
import GET_USER_PLAYLISTS from "./get-user-playlists-filtered-by-song.gql"

import "./index.scss"

const bem =
	createBEM("AddSongToPlaylistPage")

const AddSongToPlaylistPage: VFC = () => {
	const navigate = useNavigate()
	const params = useParams<keyof SongID>()
	const songID = addDashesToUUID(params.songID!)

	const [ playlistID, setPlaylistID ] =
		useState<string | null>(null)

	const { data: songData } =
		useQuery<GetSongData, SongID>(
			GET_SONG_DATA,
			{ variables: { songID } },
		)

	const { data: playlistsData } =
		useQuery<GetUserPlaylistsData, SongID>(
			GET_USER_PLAYLISTS,
			{ fetchPolicy: "no-cache", variables: { songID } },
		)

	const [ add ] =
		useMutation<AddSongToPlaylistData, AddSongToPlaylistVars>(
			ADD_SONG_TO_PLAYLIST,
		)

	const handleClose =
		() => navigate(-1)

	const handleAdd =
		async () => {
			if (playlistID) {
				try {
					await add({ variables: { songID, playlistID } })
				} finally {
					handleClose()
				}
			}
		}

	const handlePlaylistSelect =
		(value: string) =>
			setPlaylistID(value === playlistID ? null : value)

	return (
		<div className={bem("", "Content PaddingTopBottom")}>
			{songData && playlistsData && (
				<Fragment>
					<img
						crossOrigin="anonymous"
						alt={songData.getSongByID.album.title}
						title={songData.getSongByID.album.title}
						className={bem("cover", "Card Elevated")}
						src={createCatalogImageURL(
							songData.getSongByID.album.albumID,
							"cover",
							ImageSizes.HALF,
							ImageDimensions.SQUARE,
						)}
					/>
					<h1 className="BodyOne">
						<SongTitle
							song={songData.getSongByID}
						/>
					</h1>
					{!isEmpty(playlistsData.getUser.playlistsFilteredBySong) ? (
						<Playlists
							hideModal
							hideInLibrary
							orderBy={false}
							className={bem("playlists")}
							selectedClassName={bem("selected")}
							playlistClassName={bem("playlist")}
							onPlaylistClick={handlePlaylistSelect}
							isSelected={value => value === playlistID}
							playlists={playlistsData.getUser.playlistsFilteredBySong}
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
							onClick={handleClose}
						/>
						<Button
							icon="add"
							text="Add"
							onClick={handleAdd}
						/>
					</div>
				</Fragment>
			)}
		</div>
	)
}

interface GetSongData {
	getSongByID: Song,
}

interface GetUserPlaylistsData {
	getUser: User,
}

type AddSongToPlaylistDataPick =
	Pick<
		Playlist,
		"__typename" | "playlistID" | "songs"
	>

interface AddSongToPlaylistVars
	extends SongID, PlaylistID {}

interface AddSongToPlaylistData {
	addSongToPlaylist: AddSongToPlaylistDataPick,
}

export default AddSongToPlaylistPage