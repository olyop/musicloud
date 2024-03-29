import { createBEM } from "@oly_op/bem";
import { ImageDimensions, ImageSizes, SongID } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import { FC, Fragment, createElement } from "react";
import { useParams } from "react-router-dom";

import FeaturingArtists from "../../components/featuring-artists";
import ObjectLink from "../../components/object-link";
import ObjectLinks from "../../components/object-links";
import {
	createCatalogImageURL,
	createObjectPath,
	deserializeDuration,
	formatPlays,
} from "../../helpers";
import { usePlaySong, useQuery } from "../../hooks";
import Page from "../../layouts/page";
import { useStatePlay } from "../../redux";
import { Song } from "../../types";
import GET_SONG_PAGE from "./get-song-page.gql";
import "./index.scss";

const bem = createBEM("SongPage");

const SongPagePlayButton: FC<PropTypes> = ({ song }) => {
	const play = useStatePlay();

	const [playSong, isPlaying] = usePlaySong(song);

	return (
		<Button
			transparent
			title="Play"
			onClick={playSong}
			className="Border"
			text={play && isPlaying ? "Pause" : "Play"}
			icon={play && isPlaying ? "pause" : "play_arrow"}
		/>
	);
};

const SongPage: FC<PropTypes> = ({ song }) => (
	<Head pageTitle={song.title}>
		<Page childrenClassName="PaddingTopBottom">
			<div className={bem("", "Content")}>
				<img
					alt={song.album.title}
					crossOrigin="anonymous"
					className={bem("img", "Elevated")}
					src={createCatalogImageURL(
						song.album.albumID,
						"cover",
						ImageSizes.FULL,
						ImageDimensions.SQUARE,
					)}
				/>
				<div>
					<div className="FlexRowGapHalf MarginBottomHalf">
						<h1 className="HeadingFour">{song.title}</h1>
						<SongPagePlayButton song={song} />
					</div>
					<h2 className="HeadingFive MarginBottomHalf">
						<FeaturingArtists song={song} />
					</h2>
					<h3 className="ParagraphTwo MarginBottomHalf">
						<ObjectLink
							link={{
								text: song.album.title,
								path: createObjectPath("album", song.album.albumID),
							}}
						/>
					</h3>
					<h3 className="ParagraphOne MarginBottom LightColor LightWeight">
						<ObjectLinks
							links={song.genres.map(({ genreID, name }) => ({
								text: name,
								path: createObjectPath("genre", genreID),
							}))}
						/>
					</h3>
					<h4 className="ParagraphTwo MarginBottomQuart">
						Released:
						<Fragment> </Fragment>
						{song.album.released}
					</h4>
					<h4 className="ParagraphTwo MarginBottomQuart">
						Duration:
						<Fragment> </Fragment>
						{deserializeDuration(song.duration)}
					</h4>
					{song.playsTotal && (
						<h4 className="ParagraphTwo MarginBottomQuart">
							Plays:
							<Fragment> </Fragment>
							{formatPlays(song.playsTotal)}
						</h4>
					)}
					<h4 className="ParagraphTwo MarginBottomQuart">
						Size:
						<Fragment> </Fragment>
						{(song.size * 1e-6).toFixed(2)}
						<Fragment> MB</Fragment>
					</h4>
					<h4 className="ParagraphTwo MarginBottomQuart">
						BPM:
						<Fragment> </Fragment>
						{song.bpm}
						<Fragment> BPM</Fragment>
					</h4>
					<h4 className="ParagraphTwo">
						Key:
						<Fragment> </Fragment>
						{song.key.sharp}
					</h4>
				</div>
			</div>
		</Page>
	</Head>
);

interface PropTypes {
	song: Song;
}

const SongPageWrapper: FC = () => {
	const params = useParams<keyof SongID>();
	const songID = addDashesToUUID(params.songID!);

	const { data, error } = useQuery<GetSongPageData, SongID>(GET_SONG_PAGE, {
		variables: { songID },
	});

	if (error) {
		return (
			<h2 className="Content ParagraphOne PaddingTopBottom">
				{error.message === "Failed to fetch" ? error.message : "Song does not exist."}
			</h2>
		);
	} else if (data) {
		return <SongPage song={data.getSongByID} />;
	} else {
		return null;
	}
};

interface GetSongPageData {
	getSongByID: Song;
}

export default SongPageWrapper;
