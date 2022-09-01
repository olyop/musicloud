import isEmpty from "lodash-es/isEmpty"
import { createBEM } from "@oly_op/bem"
import { useState, createElement, FC, Fragment, useEffect } from "react"
import { SongID, PlaylistID } from "@oly_op/musicloud-common/build/types"

import Playlist from "../../../playlist"
import { useQuery, useMutation } from "../../../../hooks"
import { User, Playlist as PlaylistType, Song, Handler } from "../../../../types"

import ADD_SONG_TO_PLAYLIST from "./add-song-to-playlist.gql"
import GET_USER_PLAYLISTS from "./get-user-playlists-filtered-by-song.gql"

import "./index.scss"
import { ModalButton, ModalButtons } from "../../../modal"
import Playlists from "../../../playlists"

const bem =
	createBEM("AddToPlaylist")

const AddToPlaylist: FC<PropTypes> = ({ song, onClose }) => {
	const { songID } = song

	const [ playlistID, setPlaylistID ] =
		useState<string | null>(null)

	const { data: playlistsData } =
		useQuery<GetUserPlaylistsData, SongID>(GET_USER_PLAYLISTS, {
			variables: { songID },
			fetchPolicy: "cache-and-network",
		})

	const [ add, { data: mutationData } ] =
		useMutation<AddToPlaylistData, AddToPlaylistVars>(ADD_SONG_TO_PLAYLIST)

	const handleAdd =
		() => {
			if (playlistID) {
				void add({
					variables: { songID, playlistID },
				})
			}
		}

	const handlePlaylistSelect =
		(value: string) =>
			() => setPlaylistID(value === playlistID ? null : value)

	useEffect(() => {
		if (mutationData) {
			onClose()
			setPlaylistID(null)
		}
	}, [mutationData])

	return (
		<Fragment>
			{playlistsData ? (
				<Fragment>
					{isEmpty(playlistsData.getUser.playlistsFilteredBySong) ? (
						<p className="ParagraphOne Center PaddingTopBottom">
							No playlists to add to.
						</p>
					) : (
						<Playlists hideElevated>
							{playlistsData.getUser.playlistsFilteredBySong.map(
								playlist => (
									<Playlist
										hidePlay
										hidePlays
										hideModal
										hideInLibrary
										playlist={playlist}
										key={playlist.playlistID}
										onClick={handlePlaylistSelect(playlist.playlistID)}
										className={bem(
											"playlist",
											playlist.playlistID === playlistID && "selected",
										)}
									/>
								),
							)}
						</Playlists>
					)}
					<ModalButtons className="BorderTop">
						{isEmpty(playlistsData.getUser.playlistsFilteredBySong) || (
							<ModalButton
								icon="add"
								text="Add To Playlist"
								onClick={handleAdd}
							/>
						)}
						<ModalButton
							text="Cancel"
							icon="arrow_back"
							onClick={onClose}
						/>
					</ModalButtons>
				</Fragment>
			) : (
				<p className="ParagraphOne Center PaddingTopBottom">
					Loading...
				</p>
			)}
		</Fragment>
	)
}

interface GetUserPlaylistsData {
	getUser: User,
}

interface AddToPlaylistVars
	extends SongID, PlaylistID {}

interface AddToPlaylistData {
	addSongToPlaylist: PlaylistType,
}

interface PropTypes {
	song: Song,
	onClose: Handler,
}

export default AddToPlaylist