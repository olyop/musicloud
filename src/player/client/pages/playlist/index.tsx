import Button from "@oly_op/react-button"
import Metadata from "@oly_op/react-metadata"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { useParams, useHistory } from "react-router-dom"
import { createElement, FC, Fragment, useState } from "react"
import { PlaylistIDBase, SongIDBase } from "@oly_op/music-app-common/types"

import {
	useQuery,
	useMutation,
	usePlayPlaylist,
	useDeletePlaylist,
	useRenamePlaylist,
} from "../../hooks"

import {
	getUserID,
	determinePlural,
	determineObjectPath,
} from "../../helpers"

import Modal from "../../components/modal"
import { Playlist, User } from "../../types"
import TextField from "../../components/text-field"
import ObjectLink from "../../components/object-link"
import SHUFFLE_PLAYLIST from "./shuffle-playlist.gql"
import GET_PLAYLIST_PAGE from "./get-playlist-page.gql"
import Songs, { OnRemoveOptions } from "../../components/songs"
import REMOVE_SONG_FROM_PLAYLIST from "./remove-song-from-playlist.gql"

const PlaylistPage: FC = () => {
	const userID = getUserID()
	const history = useHistory()
	const params = useParams<PlaylistIDBase>()
	const playlistID = addDashesToUUID(params.playlistID)

	const variables: PlaylistIDBase =
		{ playlistID }

	const [ renameModal, setRenameModal ] =
		useState(false)

	const [ renameTitle, setRenameTitle ] =
		useState("")

	const [ renamePlaylist ] =
		useRenamePlaylist(playlistID)

	const [ deletePlaylist ] =
		useDeletePlaylist(playlistID)

	const [ playPlaylist, isPlaying ] =
		usePlayPlaylist(playlistID)

	const { data } =
		useQuery<PlaylistPageData, PlaylistIDBase>(
			GET_PLAYLIST_PAGE,
			{ variables },
		)

	const [ shufflePlaylist ] =
		useMutation<ShufflePlaylistData, PlaylistIDBase>(
			SHUFFLE_PLAYLIST,
			{ variables },
		)

	const [ removeSongFromPlaylist ] =
		useMutation<RemoveSongFromPlaylistData, RemoveSongFromPlaylistVars>(
			REMOVE_SONG_FROM_PLAYLIST,
		)

	const isUsers =
		data?.playlist.user.userID === userID

	const handleDeletePlaylist =
		async () => {
			await deletePlaylist()
			history.goBack()
		}

	const handleShufflePlaylist =
		async () => {
			await shufflePlaylist()
		}

	const handleRemoveSongFromPlaylist =
		({ song: { songID } }: OnRemoveOptions) =>
			async () => {
				await removeSongFromPlaylist({
					variables: {
						songID,
						playlistID,
					},
				})
			}

	const handleRenameModalOpen =
		() => setRenameModal(true)

	const handleRenameModalClose =
		() => setRenameModal(false)

	const handleTitleRenameChange =
		(value: string) =>
			setRenameTitle(value)

	const handleTitleRenameSubmit =
		async () => {
			await renamePlaylist(renameTitle)
			handleRenameModalClose()
		}

	return (
		<Fragment>
			<div className="Content PaddingTopBottom">
				{data && (
					<Metadata title={data.playlist.title}>
						<div className="MarginBottom FlexColumnGapHalf">
							<div className="FlexListGapHalf">
								<h1 className="HeadingFour">
									{data.playlist.title}
								</h1>
								<Button
									text="Play"
									transparent
									className="Border"
									onClick={playPlaylist}
									icon={isPlaying ? "pause" : "play_arrow"}
								/>
							</div>
							<p className="BodyOne LightColor">
								{new Date(data.playlist.dateCreated).toLocaleDateString()}
							</p>
							<h2 className="BodyOne">
								<ObjectLink
									text={data.playlist.user.name}
									path={determineObjectPath("user", data.playlist.user.userID)}
								/>
							</h2>
						</div>
						{data.playlist.songsTotal ? (
							<Songs
								hideOrderBy
								className="MarginBottom"
								songs={data.playlist.songs}
								onRemove={handleRemoveSongFromPlaylist}
							/>
						) : (
							<p className="BodyTwo MarginBottom">
								No songs.
							</p>
						)}
						<div className="FlexListGapHalf">
							<Button
								icon="shuffle"
								text="Shuffle"
								onClick={handleShufflePlaylist}
							/>
							{isUsers && (
								<Fragment>
									<Button
										icon="edit"
										text="Rename"
										onClick={handleRenameModalOpen}
									/>
									<Button
										icon="delete"
										text="Delete"
										onClick={handleDeletePlaylist}
									/>
								</Fragment>
							)}
						</div>
						{data.playlist.songsTotal && (
							<p className="MarginTop BodyTwoBold">
								{data.playlist.songsTotal}
								<Fragment> song</Fragment>
								{determinePlural(data.playlist.songsTotal)}
							</p>
						)}
					</Metadata>
				)}
			</div>
			<Modal
				open={renameModal}
				className="Padding"
				onClose={handleRenameModalClose}
			>
				<h1 className="HeadingFive MarginBottom">
					Rename
				</h1>
				<TextField
					name="Title"
					value={renameTitle}
					placeholder="Title"
					className="MarginBottom"
					fieldID="addToPlaylistTitle"
					onChange={handleTitleRenameChange}
				/>
				<div className="FlexListGapHalf">
					<Button
						icon="edit"
						text="Rename"
						onClick={handleTitleRenameSubmit}
					/>
					<Button
						transparent
						icon="close"
						text="Close"
						onClick={handleRenameModalClose}
					/>
				</div>
			</Modal>
		</Fragment>
	)
}

interface PlaylistPageData {
	playlist: Playlist,
}

interface ShufflePlaylistData {
	shufflePlaylist: User,
}

interface RemoveSongFromPlaylistData {
	removeSongFromPlaylist: Playlist,
}

interface RemoveSongFromPlaylistVars extends
	SongIDBase,
	PlaylistIDBase {}

export default PlaylistPage