import { Link } from "react-router-dom"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { createElement, FC } from "react"

import {
	Song as SongType,
	Album as AlbumType,
	Playlist as PlaylistType,
} from "../types"

import Page from "../layouts/page"
import { useQuery } from "../hooks"
import Song from "../components/song"
import Songs from "../components/songs"
import Album from "../components/album"
import Albums from "../components/albums"
import Playlist from "../components/playlist"
import Playlists from "../components/playlists"

import GET_HOME_PAGE from "./get-home-page.gql"

import "./index.scss"

const bem =
	createBEM("HomePage")

const HomePage: FC = () => {
	const { data } = useQuery<Data>(GET_HOME_PAGE)
	return (
		<Head pageTitle="Home">
			<Page>
				{data && (
					<div className={bem("", "ContentPaddingTopBottom")}>
						<div className={bem("trending", "FlexColumn")}>
							<div className="FlexColumnGapHalf">
								<h2 className="HeadingFive">
									Trending Albums
								</h2>
								<Albums alwaysList hideOrderBy albums={data.getTrendingAlbums}>
									{albums => albums.map(
										album => (
											<Album
												alwaysList
												album={album}
												hideInLibrary
												key={album.albumID}
											/>
										),
									)}
								</Albums>
								{/* <Button
									transparent
									text="View All"
									icon="arrow_forward"
									style={{ alignSelf: "flex-start" }}
								/> */}
							</div>
							<div className="FlexColumnGapHalf">
								<h2 className="HeadingFive">
									Trending Playlists
								</h2>
								<Playlists playlists={data.getTrendingPlaylists}>
									{playlists => playlists.map(
										playlist => (
											<Playlist
												hideModal
												hideInLibrary
												playlist={playlist}
												key={playlist.playlistID}
											/>
										),
									)}
								</Playlists>
								{/* <Button
									transparent
									text="View All"
									icon="arrow_forward"
									style={{ alignSelf: "flex-start" }}
								/> */}
							</div>
						</div>
						<div className="FlexColumnGapHalf">
							<h2 className="HeadingFive">
								Top Ten Songs
							</h2>
							<Songs songs={data.getTopTenSongs}>
								{songs => songs.map(
									song => (
										<Song
											song={song}
											hideDuration
											hideInLibrary
											hideTrackNumber
											key={song.songID}
										/>
									),
								)}
							</Songs>
							<Link to="/top-one-hundred-songs">
								<Button
									transparent
									text="View All"
									icon="arrow_forward"
								/>
							</Link>
						</div>
					</div>
				)}
			</Page>
		</Head>
	)
}

interface Data {
	getTopTenSongs: SongType[],
	getTrendingAlbums: AlbumType[],
	getTrendingPlaylists: PlaylistType[],
}

export default HomePage