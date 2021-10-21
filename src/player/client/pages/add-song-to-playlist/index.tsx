import {
	ImageSizes,
	SongIDBase,
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

import { User, Song } from "../../types"
import GET_SONG_DATA from "./get-song-data.gql"
import Playlists from "../../components/playlists"
import { useQuery, useMutation } from "../../hooks"
import ObjectLink from "../../components/object-link"
import ADD_SONG_TO_PLAYLIST from "./add-song-to-playlist.gql"
import { determineObjectPath, determineCatalogImageURL } from "../../helpers"
import GET_USER_PLAYLISTS_FILTERED_BY_SONG from "./get-user-playlists-filtered-by-song.gql"

import "./index.scss"

interface SongData {
	song: Song,
}

interface PlaylistsData {
	user: User,
}

interface AddVars
	extends SongIDBase, PlaylistIDBase {}

const bem =
	createBEM("AddSongToPlaylistPage")

const AddSongToPlaylistPage: FC = () => {
	const history = useHistory()
	const params = useParams<SongIDBase>()
	const songID = addDashesToUUID(params.songID)

	const [ playlistID, setPlaylistID ] =
		useState<string | null>(null)

	const { data: songData } =
		useQuery<SongData, SongIDBase>(
			GET_SONG_DATA,
			{ variables: { songID } },
		)

	const { data: playlistsData } =
		useQuery<PlaylistsData, SongIDBase>(
			GET_USER_PLAYLISTS_FILTERED_BY_SONG,
			{ fetchPolicy: "no-cache", variables: { songID } },
		)

	const [ add ] =
		useMutation<unknown, AddVars>(ADD_SONG_TO_PLAYLIST, {
			update: cache => {
				cache.modify({
					id: cache.identify({
						playlistID,
						__typename: "Playlist",
					}),
					fields: {
						songs: (existing: Song[]) => [
							...existing,
							songData?.song,
						],
					},
				})
			},
		})

	const onClose =
		() => history.goBack()

	const handleAdd =
		async () => {
			if (playlistID) {
				await add({ variables: { songID, playlistID } })
				onClose()
			}
		}

	const handlePlaylistSelect =
		(value: string) =>
			setPlaylistID(value === playlistID ? null : value)

	return songData && playlistsData ? (
		<div className={bem("", "Content PaddingTopBottom")}>
			<Image
				title={songData.song.album.title}
				className={bem("cover", "Card Elevated")}
				url={determineCatalogImageURL(
					songData.song.album.albumID,
					"cover",
					ImageSizes.HALF,
					ImageDimensions.SQUARE,
				)}
			/>
			<h1 className="BodyOne">
				<ObjectLink
					text={songData.song.title}
					path={determineObjectPath(
						"song",
						songData.song.songID,
					)}
				/>
			</h1>
			{!isEmpty(playlistsData.user.playlistsFilteredBySong) ? (
				<Playlists
					hideModal
					hideOrderBy
					hideInLibrary
					className={bem("playlists")}
					selectedClassName={bem("selected")}
					playlistClassName={bem("playlist")}
					onPlaylistClick={handlePlaylistSelect}
					isSelected={value => value === playlistID}
					playlists={playlistsData.user.playlistsFilteredBySong}
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

export default AddSongToPlaylistPage