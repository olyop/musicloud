import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { useParams } from "react-router-dom"
import { createElement, FC, Fragment } from "react"
import { PlaylistID } from "@oly_op/musicloud-common"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { isNull, toLower, startCase, isEmpty } from "lodash-es"

import {
	useQuery,
	useMutation,
	useJWTPayload,
	usePlayPlaylist,
	useShufflePlaylist,
} from "../../hooks"

import Song from "../../components/song"
import Page from "../../components/page"
import DeleteButton from "./delete-button"
import RenameButton from "./rename-button"
import Songs from "../../components/songs"
import { useStatePlay } from "../../redux"
import PrivacyButton from "./privacy-button"
import Buttons from "../../components/buttons"
import Content from "../../components/content"
import InLibraryButton from "./in-library-button"
import ObjectLink from "../../components/object-link"
import GET_PLAYLIST_PAGE from "./get-playlist-page.gql"
import { Playlist, SongPlaylistIndex } from "../../types"
import { determinePlural, createObjectPath } from "../../helpers"
import REMOVE_SONG_FROM_PLAYLIST from "./remove-song-from-playlist.gql"

const PlaylistPage: FC = () => {
	const play = useStatePlay()
	const { userID } = useJWTPayload()
	const params = useParams<keyof PlaylistID>()
	const playlistID = addDashesToUUID(params.playlistID!)

	const variables: PlaylistID = { playlistID }

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

	const handleRemoveSongFromPlaylist =
		({ playlistIndex }: SongPlaylistIndex) =>
			() => {
				if (!isNull(playlistIndex)) {
					void removeSongFromPlaylist({
						variables: {
							playlistID,
							index: playlistIndex,
						},
					})
				}
			}

	const handleShare =
		() => {
			if ("share" in navigator && data) {
				void navigator.share({
					title: data.getPlaylistByID.title,
					url: createObjectPath("playlist", data.getPlaylistByID.playlistID),
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

	if (data) {
		const playlist = data.getPlaylistByID
		const { title, user, dateCreated, privacy, songs, songsTotal } = playlist
		return (
			<Head pageTitle={title}>
				<Page>
					<Content className="FlexColumnGap">
						<div className="FlexColumnGapHalf">
							<div className="FlexRowGapHalf">
								<h1 className="HeadingFour">
									{title}
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
										text: user.name,
										path: createObjectPath("user", user.userID),
									}}
								/>
								<Fragment> - </Fragment>
								{startCase(toLower(privacy))}
							</h2>
							<p className="BodyOne LightColor">
								{(new Date(dateCreated)).toLocaleDateString()}
							</p>
						</div>
						{isEmpty(songs) ? (
							<p className="BodyOneBold">
								No songs.
							</p>
						) : (
							<Songs songs={songs}>
								{songs.map(
									song => (
										<Song
											song={song}
											key={song.songID}
											index={playlist.playlistIndex!}
											onRemove={isUsers ? handleRemoveSongFromPlaylist(song) : undefined}
										/>
									),
								)}
							</Songs>
						)}
						{songsTotal && (
							<p className="BodyTwoBold">
								{songsTotal}
								<Fragment> song</Fragment>
								{determinePlural(songsTotal)}
							</p>
						)}
						<Buttons>
							<Button
								icon="shuffle"
								text="Shuffle"
								onClick={shufflePlaylist}
							/>
							{isUsers || (
								<InLibraryButton
									playlist={playlist}
								/>
							)}
							<Button
								icon="share"
								text="Share"
								onClick={handleShare}
							/>
						</Buttons>
						{isUsers && (
							<div className="FlexColumnGapHalf">
								<p className="BodyOneBold">
									Actions
								</p>
								<Buttons>
									<PrivacyButton
										playlist={playlist}
									/>
									<RenameButton
										playlist={playlist}
									/>
									<DeleteButton
										playlistID={playlistID}
									/>
								</Buttons>
							</div>
						)}
					</Content>
				</Page>
			</Head>
		)
	} else {
		return <Page/>
	}
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