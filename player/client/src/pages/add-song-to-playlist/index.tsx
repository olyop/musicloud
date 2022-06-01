import {
	SongID,
	ImageSizes,
	PlaylistID,
	ImageDimensions,
} from "@oly_op/musicloud-common"

import isEmpty from "lodash-es/isEmpty"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { useNavigate, useParams } from "react-router-dom"
import { useState, createElement, FC, Fragment, useEffect } from "react"

import Content from "../../components/content"
import GET_SONG_DATA from "./get-song-data.gql"
import Playlist from "../../components/playlist"
import Playlists from "../../components/playlists"
import SongTitle from "../../components/song-title"
import { useQuery, useMutation } from "../../hooks"
import { createCatalogImageURL } from "../../helpers"
import ADD_SONG_TO_PLAYLIST from "./add-song-to-playlist.gql"
import { User, Song, Playlist as PlaylistType } from "../../types"
import GET_USER_PLAYLISTS from "./get-user-playlists-filtered-by-song.gql"

import "./index.scss"

const bem =
	createBEM("AddSongToPlaylistPage")

const AddSongToPlaylistPage: FC = () => {
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

	const [ add, { data } ] =
		useMutation<AddSongToPlaylistData, AddSongToPlaylistVars>(
			ADD_SONG_TO_PLAYLIST,
		)

	const handleClose =
		() => navigate(-1)

	const handleAdd =
		() => {
			if (playlistID) {
				void add({ variables: { songID, playlistID } })
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

	return (
		<Content className={bem("")}>
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
					{isEmpty(playlistsData.getUser.playlists) ? (
						<p className="BodyTwo">
							No playlists to add to.
						</p>
					) : (
						<Playlists className={bem("playlists")} playlists={playlistsData.getUser.playlists}>
							{playlists => playlists.map(
								playlist => (
									<Playlist
										hideModal
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
				</Fragment>
			)}
		</Content>
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
		PlaylistType,
		"__typename" | "playlistID" | "songs"
	>

interface AddSongToPlaylistVars
	extends SongID, PlaylistID {}

interface AddSongToPlaylistData {
	addSongToPlaylist: AddSongToPlaylistDataPick,
}

export default AddSongToPlaylistPage