import Button from "@oly_op/react-button"
import { useParams } from "react-router-dom"
import { Metadata } from "@oly_op/react-metadata"
import { createElement, VFC, Fragment } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { isNull, toLower, startCase } from "lodash-es"
import { PlaylistID } from "@oly_op/music-app-common/types"

import {
	useQuery,
	useMutation,
	useJWTPayload,
	usePlayPlaylist,
	useShufflePlaylist,
} from "../../hooks"

import { Playlist } from "../../types"
import DeleteButton from "./delete-button"
import RenameButton from "./rename-button"
import { useStatePlay } from "../../redux"
import PrivacyButton from "./privacy-button"
import Buttons from "../../components/buttons"
import InLibraryButton from "./in-library-button"
import ObjectLink from "../../components/object-link"
import GET_PLAYLIST_PAGE from "./get-playlist-page.gql"
import Songs, { SongChangeOptions } from "../../components/songs"
import { determinePlural, createObjectPath } from "../../helpers"
import REMOVE_SONG_FROM_PLAYLIST from "./remove-song-from-playlist.gql"

const PlaylistPage: VFC = () => {
	const play = useStatePlay()
	const { userID } = useJWTPayload()
	const params = useParams<keyof PlaylistID>()
	const playlistID = addDashesToUUID(params.playlistID!)

	const variables: PlaylistID =
		{ playlistID }

	const [ playPlaylist, isPlaying ] =
		usePlayPlaylist(variables)

	const [ shufflePlaylist ] =
		useShufflePlaylist(variables)

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
		<div className="Content FlexColumnGap PaddingTopBottom">
			{data && (
				<Metadata title={data.getPlaylistByID.title}>
					<div className="FlexColumnGapHalf">
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
									path: createObjectPath("user", data.getPlaylistByID.user.userID),
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
							songs={data.getPlaylistByID.songs}
							onRemove={isUsers ? handleRemoveSongFromPlaylist : undefined}
						/>
					) : (
						<p className="BodyTwo">
							No songs.
						</p>
					)}
					<Buttons>
						<Button
							icon="shuffle"
							text="Shuffle"
							onClick={handleShufflePlaylist}
						/>
						{isUsers || (
							<InLibraryButton
								playlist={data.getPlaylistByID}
							/>
						)}
						<Button
							icon="share"
							text="Share"
						/>
					</Buttons>
					{isUsers && (
						<div className="FlexColumnGapHalf">
							<p className="BodyOneBold">
								Actions
							</p>
							<Buttons>
								<PrivacyButton
									playlist={data.getPlaylistByID}
								/>
								<RenameButton
									playlist={data.getPlaylistByID}
								/>
								<DeleteButton
									playlistID={playlistID}
								/>
							</Buttons>
						</div>
					)}
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