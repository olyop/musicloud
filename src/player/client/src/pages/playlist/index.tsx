import { PlaylistID } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import isEmpty from "lodash-es/isEmpty";
import isNull from "lodash-es/isNull";
import startCase from "lodash-es/startCase";
import toLower from "lodash-es/toLower";
import { FC, Fragment, createElement } from "react";
import { useParams } from "react-router-dom";

import Buttons from "../../components/buttons";
import Chip from "../../components/chip";
import Song from "../../components/song";
import Songs from "../../components/songs";
import { createObjectPath, determinePlural } from "../../helpers";
import {
	useJWTPayload,
	useMutation,
	usePlayPlaylist,
	useQuery,
	useShare,
	useShufflePlaylist,
} from "../../hooks";
import Page from "../../layouts/page";
import { useStatePlay } from "../../redux";
import { Playlist, SongPlaylistIndex } from "../../types";
import DeleteButton from "./delete-button";
import GET_PLAYLIST_PAGE from "./get-playlist-page.gql";
import InLibraryButton from "./in-library-button";
import PrivacyButton from "./privacy-button";
import REMOVE_SONG_FROM_PLAYLIST from "./remove-song-from-playlist.gql";
import RenameButton from "./rename-button";

const PlaylistPage: FC = () => {
	const play = useStatePlay();
	const { userID } = useJWTPayload();
	const params = useParams<keyof PlaylistID>();
	const playlistID = addDashesToUUID(params.playlistID!);

	const [share, { shareIcon, shareText }] = useShare();

	const variables: PlaylistID = { playlistID };

	const [playPlaylist, isPlaying] = usePlayPlaylist(variables);

	const [shufflePlaylist] = useShufflePlaylist(variables);

	const { data, error } = useQuery<GetPlaylistPageData, PlaylistID>(GET_PLAYLIST_PAGE, {
		variables,
	});

	const [removeSongFromPlaylist] = useMutation<unknown, RemoveSongFromPlaylistVars>(
		REMOVE_SONG_FROM_PLAYLIST,
	);

	const isUsers = data?.getPlaylistByID.user.userID === userID;

	const handleRemoveSongFromPlaylist =
		({ playlistIndex }: SongPlaylistIndex) =>
		() => {
			if (!isNull(playlistIndex)) {
				void removeSongFromPlaylist({
					variables: {
						playlistID,
						index: playlistIndex,
					},
				});
			}
		};

	if (error?.message === "Playlist does not exist") {
		return <p className="ParagraphOneBold Padding">{error.message}</p>;
	}

	if (data) {
		const playlist = data.getPlaylistByID;
		const { title, user, dateCreated, privacy, songs, songsTotal, playlistIndex } = playlist;

		const handleShare = () => {
			void share({
				title,
				url: createObjectPath("artist", playlistID),
			});
		};

		return (
			<Head pageTitle={title}>
				<Page>
					<div className="ContentPaddingTopBottom FlexColumnGap">
						<div>
							<div key={1} className="FlexRowGapHalf MarginBottomHalf">
								<h1 className="HeadingFour">{title}</h1>
								<Button
									text="Play"
									transparent
									className="Border"
									onClick={playPlaylist}
									icon={play && isPlaying ? "pause" : "play_arrow"}
								/>
							</div>
							<div className="FlexRowGapHalf MarginBottomThreeQuart">
								<Chip typeName="user" text={user.name} key={user.userID} objectID={user.userID} />
							</div>
							<p className="ParagraphOne LightColor MarginBottomThreeQuart">
								{new Date(dateCreated).toLocaleDateString()}
							</p>
							<h2 className="ParagraphOne">
								<Fragment>Privacy: </Fragment>
								{startCase(toLower(privacy))}
							</h2>
						</div>
						{isEmpty(songs) ? (
							<p className="ParagraphOneBold">No songs.</p>
						) : (
							<Songs songs={songs}>
								{songs.map(song => (
									<Song
										hidePlays
										shareIcon
										song={song}
										key={song.songID}
										index={playlistIndex!}
										showDateAddedToPlaylist
										onRemove={isUsers ? handleRemoveSongFromPlaylist(song) : undefined}
									/>
								))}
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
							<Button icon="shuffle" text="Shuffle" onClick={shufflePlaylist} />
							{isUsers || <InLibraryButton playlist={playlist} />}
							<Button icon={shareIcon} text={shareText} onClick={handleShare} />
						</Buttons>
						{isUsers && (
							<div className="FlexColumnGapHalf">
								<p className="ParagraphOneBold">Actions</p>
								<Buttons>
									<PrivacyButton playlist={playlist} />
									<RenameButton playlist={playlist} />
									<DeleteButton playlistID={playlistID} />
								</Buttons>
							</div>
						)}
					</div>
				</Page>
			</Head>
		);
	} else {
		return <Page />;
	}
};

interface GetPlaylistPageData {
	getPlaylistByID: Playlist;
}

interface RemoveSongFromPlaylistVars extends PlaylistID {
	index: number;
}

export default PlaylistPage;
