import Button from "@oly_op/react-button"
import Metadata from "@oly_op/react-metadata"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { useParams, useNavigate } from "react-router-dom"
import { createElement, VFC, Fragment, useState } from "react"
import { PlaylistIDBase, SongIDBase } from "@oly_op/music-app-common/types"

import {
	useQuery,
	useUserID,
	useMutation,
	usePlayPlaylist,
	useDeletePlaylist,
	useRenamePlaylist,
	useShufflePlaylist,
} from "../../hooks"

import { Playlist } from "../../types"
import Modal from "../../components/modal"
import { useStatePlay } from "../../redux"
import TextField from "../../components/text-field"
import ObjectLink from "../../components/object-link"
import GET_PLAYLIST_PAGE from "./get-playlist-page.gql"
import Songs, { OnRemoveOptions } from "../../components/songs"
import { determinePlural, determineObjectPath } from "../../helpers"
import REMOVE_SONG_FROM_PLAYLIST from "./remove-song-from-playlist.gql"

const PlaylistPage: VFC = () => {
	const userID = useUserID()
	const play = useStatePlay()
	const navigate = useNavigate()
	const params = useParams<keyof PlaylistIDBase>()
	const playlistID = addDashesToUUID(params.playlistID!)

	const variables: PlaylistIDBase =
		{ playlistID }

	const [ renameModal, setRenameModal ] =
		useState(false)

	const [ renameTitle, setRenameTitle ] =
		useState("")

	const [ renamePlaylist ] =
		useRenamePlaylist({ playlistID })

	const [ deletePlaylist ] =
		useDeletePlaylist({ playlistID })

	const [ playPlaylist, isPlaying ] =
		usePlayPlaylist({ playlistID })

	const [ shufflePlaylist ] =
		useShufflePlaylist({ playlistID })

	const { data } =
		useQuery<GetPlaylistPageData, PlaylistIDBase>(
			GET_PLAYLIST_PAGE,
			{ variables },
		)

	const [ removeSongFromPlaylist ] =
		useMutation<RemoveSongFromPlaylistData, RemoveSongFromPlaylistVars>(
			REMOVE_SONG_FROM_PLAYLIST,
		)

	const isUsers =
		data?.getPlaylistByID.user.userID === userID

	const handleDeletePlaylist =
		async () => {
			await deletePlaylist()
			navigate(-1)
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
			handleRenameModalClose()
			await renamePlaylist({ title: renameTitle })
		}

	return (
		<Fragment>
			<div className="Content PaddingTopBottom">
				{data && (
					<Metadata title={data.getPlaylistByID.title}>
						<div className="MarginBottom FlexColumnGapHalf">
							<div className="FlexListGapHalf">
								<h1 className="HeadingFour">
									{data.getPlaylistByID.title}
								</h1>
								<Button
									text="Play"
									transparent
									className="Border"
									onClick={playPlaylist}
									icon={play && isPlaying ? "pause" : "play_arrow"}
								/>
							</div>
							<p className="BodyOne LightColor">
								{new Date(data.getPlaylistByID.dateCreated).toLocaleDateString()}
							</p>
							<h2 className="BodyOne">
								<ObjectLink
									link={{
										text: data.getPlaylistByID.user.name,
										path: determineObjectPath("user", data.getPlaylistByID.user.userID),
									}}
								/>
							</h2>
						</div>
						{data.getPlaylistByID.songsTotal ? (
							<Songs
								orderBy={false}
								className="MarginBottom"
								songs={data.getPlaylistByID.songs}
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
						{data.getPlaylistByID.songsTotal && (
							<p className="MarginTop BodyTwoBold">
								{data.getPlaylistByID.songsTotal}
								{" "}
								song
								{determinePlural(data.getPlaylistByID.songsTotal)}
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

interface GetPlaylistPageData {
	getPlaylistByID: Playlist,
}

interface RemoveSongFromPlaylistData {
	removeSongFromPlaylist: Playlist,
}

interface RemoveSongFromPlaylistVars
	extends SongIDBase, PlaylistIDBase {}

export default PlaylistPage