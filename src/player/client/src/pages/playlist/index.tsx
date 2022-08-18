import isNull from "lodash-es/isNull"
import toLower from "lodash-es/toLower"
import isEmpty from "lodash-es/isEmpty"
import startCase from "lodash-es/startCase"
import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { useParams } from "react-router-dom"
import { createElement, FC, Fragment } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { PlaylistID } from "@oly_op/musicloud-common/build/types"

import {
	useShare,
	useQuery,
	useMutation,
	useJWTPayload,
	usePlayPlaylist,
	useShufflePlaylist,
} from "../../hooks"

import Page from "../../layouts/page"
import Song from "../../components/song"
import DeleteButton from "./delete-button"
import RenameButton from "./rename-button"
import Songs from "../../components/songs"
import { useStatePlay } from "../../redux"
import PrivacyButton from "./privacy-button"
import Buttons from "../../components/buttons"
import InLibraryButton from "./in-library-button"
import ObjectLink from "../../components/object-link"
import { Playlist, SongPlaylistIndex } from "../../types"
import { determinePlural, createObjectPath } from "../../helpers"

import GET_PLAYLIST_PAGE from "./get-playlist-page.gql"
import REMOVE_SONG_FROM_PLAYLIST from "./remove-song-from-playlist.gql"

const PlaylistPage: FC = () => {
	const play = useStatePlay()
	const { userID } = useJWTPayload()
	const params = useParams<keyof PlaylistID>()
	const playlistID = addDashesToUUID(params.playlistID!)

	const [ share, shareText ] =
		useShare("Share")

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

	if (error?.message === "Playlist does not exist") {
		return (
			<p className="ParagraphOneBold Padding">
				{error.message}
			</p>
		)
	}

	if (data) {
		const playlist = data.getPlaylistByID
		const { title, user, dateCreated, privacy, songs, songsTotal, playlistIndex } = playlist

		const handleShare =
			() => {
				share({
					title,
					url: createObjectPath("artist", playlistID),
				})
			}

		return (
			<Head pageTitle={title}>
				<Page>
					<div className="ContentPaddingTopBottom FlexColumnGap">
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
							<h2 className="ParagraphOne">
								<ObjectLink
									link={{
										text: user.name,
										path: createObjectPath("user", user.userID),
									}}
								/>
								<Fragment> - </Fragment>
								{startCase(toLower(privacy))}
							</h2>
							<p className="ParagraphOne LightColor">
								{(new Date(dateCreated)).toLocaleDateString()}
							</p>
						</div>
						{isEmpty(songs) ? (
							<p className="ParagraphOneBold">
								No songs.
							</p>
						) : (
							<Songs songs={songs}>
								{songs.map(
									song => (
										<Song
											hidePlays
											song={song}
											key={song.songID}
											index={playlistIndex!}
											onRemove={isUsers ? handleRemoveSongFromPlaylist(song) : undefined}
										/>
									),
								)}
							</Songs>
						)}
						{songsTotal && (
							<p className="ParagraphTwoBold">
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
								text={shareText}
								onClick={handleShare}
							/>
						</Buttons>
						{isUsers && (
							<div className="FlexColumnGapHalf">
								<p className="ParagraphOneBold">
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
					</div>
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