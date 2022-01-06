import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { createElement, VFC, Fragment } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { isNull, toLower, startCase } from "lodash-es"
import { useParams, useNavigate } from "react-router-dom"
import { PlaylistID } from "@oly_op/music-app-common/types"

import {
	useQuery,
	useJWTPayload,
	useMutation,
	usePlayPlaylist,
	useDeletePlaylist,
	useShufflePlaylist,
} from "../../hooks"

import { Playlist } from "../../types"
import { useStatePlay } from "../../redux"
import RenameButton from "./rename-button"
import PrivacyButton from "./privacy-button"
import ObjectLink from "../../components/object-link"
import GET_PLAYLIST_PAGE from "./get-playlist-page.gql"
import Songs, { SongChangeOptions } from "../../components/songs"
import { determinePlural, determineObjectPath } from "../../helpers"
import REMOVE_SONG_FROM_PLAYLIST from "./remove-song-from-playlist.gql"

const PlaylistPage: VFC = () => {
	const play = useStatePlay()
	const navigate = useNavigate()
	const { userID } = useJWTPayload()
	const params = useParams<keyof PlaylistID>()
	const playlistID = addDashesToUUID(params.playlistID!)

	const variables: PlaylistID =
		{ playlistID }

	const [ deletePlaylist ] =
		useDeletePlaylist({ playlistID })

	const [ playPlaylist, isPlaying ] =
		usePlayPlaylist({ playlistID })

	const [ shufflePlaylist ] =
		useShufflePlaylist({ playlistID })

	const { data, error } =
		useQuery<GetPlaylistPageData, PlaylistID>(
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
		({ song }: SongChangeOptions) =>
			async () => {
				if (!isNull(song.playlistIndex)) {
					await removeSongFromPlaylist({
						variables: {
							playlistID,
							index: song.playlistIndex,
						},
					})
				}
			}

	if (error?.message === "Playlist does not exist") {
		return (
			<p className="BodyOneBold Padding">
				{error.message}
			</p>
		)
	}

	return (
		<div className="Content PaddingTopBottom">
			{data && (
				<Metadata title={data.getPlaylistByID.title}>
					<div className="MarginBottom FlexColumnGapHalf">
						<div className="FlexRowGapHalf">
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
						<h2 className="BodyOne">
							<ObjectLink
								link={{
									text: data.getPlaylistByID.user.name,
									path: determineObjectPath("user", data.getPlaylistByID.user.userID),
								}}
							/>
							<Fragment> - </Fragment>
							{startCase(toLower(data.getPlaylistByID.privacy))}
						</h2>
						<p className="BodyOne LightColor">
							{new Date(data.getPlaylistByID.dateCreated).toLocaleDateString()}
						</p>
					</div>
					{data.getPlaylistByID.songsTotal ? (
						<Songs
							orderBy={false}
							className="MarginBottom"
							songs={data.getPlaylistByID.songs}
							onRemove={isUsers ? handleRemoveSongFromPlaylist : undefined}
						/>
					) : (
						<p className="BodyTwo MarginBottom">
							No songs.
						</p>
					)}
					<div className="FlexRowGapHalf">
						<Button
							icon="shuffle"
							text="Shuffle"
							onClick={handleShufflePlaylist}
						/>
						{isUsers && (
							<Fragment>
								<PrivacyButton
									playlist={data.getPlaylistByID}
								/>
								<RenameButton
									playlist={data.getPlaylistByID}
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
	)
}

interface GetPlaylistPageData {
	getPlaylistByID: Playlist,
}

interface RemoveSongFromPlaylistData {
	removeSongFromPlaylist: Playlist,
}

interface RemoveSongFromPlaylistVars
	extends PlaylistID {
	index: number,
}

export default PlaylistPage