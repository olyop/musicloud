import { createBEM } from "@oly_op/bem";
import { AlbumID, ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import { FC, Fragment, createElement, useState } from "react";
import { useParams } from "react-router-dom";

import AddAlbumToPlaylist from "../../components/add-album-to-playlist";
import AlbumTitle from "../../components/album-title";
import Buttons from "../../components/buttons";
import Chip from "../../components/chip";
import Modal, { ModalHeader } from "../../components/modal";
import ObjectLinks from "../../components/object-links";
import {
	createCatalogImageURL,
	createObjectPath,
	determinePlural,
	formatPlays,
	formatTimestampToDate,
} from "../../helpers";
import { useQuery, useShuffleAlbum, useToggleAlbumInLibrary } from "../../hooks";
import Page from "../../layouts/page";
import { Album } from "../../types";
import createDiscs from "./create-discs";
import Disc from "./disc";
import GET_ALBUM_PAGE from "./get-album-page.gql";
import "./index.scss";
import AlbumPlayButton from "./play-button";
import ShareButton from "./share-button";

const bem = createBEM("AlbumPage");

const AlbumPage: FC = () => {
	const params = useParams<keyof AlbumID>();
	const albumID = addDashesToUUID(params.albumID!);

	const [addToPlaylistModal, setAddToPlaylistModal] = useState(false);

	const { data, error } = useQuery<GetAlbumData, AlbumID>(GET_ALBUM_PAGE, {
		variables: { albumID },
	});

	const [shuffleAlbum] = useShuffleAlbum({ albumID });

	const [toggleInLibrary, inLibrary] = useToggleAlbumInLibrary({ albumID });

	const handleAddToPlaylistModalOpen = () => {
		setAddToPlaylistModal(true);
	};

	const handleAddToPlaylistModalClose = () => {
		setAddToPlaylistModal(false);
	};

	if (error) {
		return (
			<Head pageTitle={null}>
				<Page>
					<div className="ContentPaddingTopBottom">
						<h2 className="ParagraphOne">
							{error.message === "Failed to fetch" ? error.message : "Album does not exist."}
						</h2>
					</div>
				</Page>
			</Head>
		);
	} else if (data) {
		const album = data.getAlbumByID;
		const { title, songs, duration, artists, genres, released, songsTotal, playsTotal } = album;
		const discs = createDiscs(songs);
		return (
			<Head pageTitle={title}>
				<Page>
					<div className={bem("", "ContentPaddingTopBottom")}>
						<img
							alt={title}
							crossOrigin="anonymous"
							className={bem("cover", "content", "Elevated")}
							src={createCatalogImageURL(albumID, "cover", ImageSizes.FULL, ImageDimensions.SQUARE)}
						/>
						<div className={bem("content", "FlexColumnGap")}>
							<div>
								<div className={bem("title", "MarginBottomHalf")}>
									<h1 className="HeadingFour">
										<AlbumTitle hideReleased album={album} />
									</h1>
									<AlbumPlayButton albumID={albumID} />
								</div>
								<div className="FlexRowGapHalf MarginBottomThreeQuart">
									{artists.map(artist => (
										<Chip
											typeName="artist"
											text={artist.name}
											key={artist.artistID}
											objectID={artist.artistID}
										/>
									))}
								</div>
								<h3 className="ParagraphOne LightColor MarginBottomHalf LightWeight">
									{formatTimestampToDate(released)}
								</h3>
								<h3 className="ParagraphTwo LightColor LightWeight">
									<ObjectLinks
										links={genres.map(({ genreID, name }) => ({
											text: name,
											path: createObjectPath("genre", genreID),
										}))}
									/>
								</h3>
							</div>
							{discs.map(disc => (
								<Disc disc={disc} key={disc.index} isSingle={disc.songs.length === 1} />
							))}
							<Buttons>
								<Button icon="shuffle" text="Shuffle" onClick={shuffleAlbum} />
								<Button
									onClick={toggleInLibrary}
									icon={inLibrary ? "done" : "add"}
									text={inLibrary ? "Remove" : "Add"}
								/>
								<Button
									text="Playlist"
									icon="playlist_add"
									onClick={handleAddToPlaylistModalOpen}
								/>
								<Modal open={addToPlaylistModal} onClose={handleAddToPlaylistModalClose}>
									<ModalHeader
										text={<AlbumTitle hideReleased album={album} />}
										image={{
											description: `Add ${title} to Playlist`,
											src: createCatalogImageURL(
												albumID,
												"cover",
												ImageSizes.MINI,
												ImageDimensions.SQUARE,
											),
										}}
									/>
									<AddAlbumToPlaylist albumID={albumID} onClose={handleAddToPlaylistModalClose} />
								</Modal>
								<ShareButton album={album} />
							</Buttons>
							<div className="FlexColumnGapQuart">
								<p className="ParagraphTwo LightColor">
									{discs.length > 1 && (
										<Fragment>
											{discs.length}
											<Fragment> discs, </Fragment>
										</Fragment>
									)}
									{songs.length}
									<Fragment> song</Fragment>
									{determinePlural(songsTotal)}
									<Fragment>, </Fragment>
									{Math.floor(duration / 60)}
									<Fragment> minutes, </Fragment>
									{Math.floor(duration % 60)}
									<Fragment> seconds</Fragment>
								</p>
								{playsTotal && (
									<p className="ParagraphTwo LightColor">
										{formatPlays(playsTotal)} play{determinePlural(playsTotal)}
									</p>
								)}
							</div>
						</div>
					</div>
				</Page>
			</Head>
		);
	} else {
		return <Page />;
	}
};

interface GetAlbumData {
	getAlbumByID: Album;
}

export default AlbumPage;
