import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { Metadata } from "@oly_op/react-metadata"
import { createElement, VFC, Fragment } from "react"

import { useQuery } from "../../hooks"
import Songs from "../../components/songs"
import Albums from "../../components/albums"
import Playlists from "../../components/playlists"
import GET_BROWSE_PAGE from "./get-browse-page.gql"
import { Song, Album, Playlist } from "../../types"

import "./index.scss"

const bem =
	createBEM("BrowsePage")

const BrowsePage: VFC = () => {
	const { data } = useQuery<GetBrowsePageData>(GET_BROWSE_PAGE)
	return (
		<Metadata>
			<div className="Content FlexColumnGap PaddingTopBottom">
				<div className={bem("")}>
					{data && (
						<Fragment>
							<div className={bem("trending", "FlexColumn")}>
								<div className="FlexColumnGapHalf">
									<h2 className="HeadingFive">
										Trending Albums
									</h2>
									<Albums
										hideModal
										alwaysList
										hideInLibrary
										orderBy={false}
										albums={data.getTrendingAlbums}
									/>
									<Button
										transparent
										text="View All"
										icon="arrow_forward"
										style={{ alignSelf: "flex-start" }}
									/>
								</div>
								<div className="FlexColumnGapHalf">
									<h2 className="HeadingFive">
										Trending Playlists
									</h2>
									<Playlists
										hideModal
										hideInLibrary
										orderBy={false}
										playlists={data.getTrendingPlaylists}
									/>
									<Button
										transparent
										text="View All"
										icon="arrow_forward"
										style={{ alignSelf: "flex-start" }}
									/>
								</div>
							</div>
							<div>
								<h2 className="HeadingFive MarginBottomHalf">
									Top Ten Songs
								</h2>
								<Songs
									hideCover
									hideIndex
									hideModal
									hideDuration
									hideInLibrary
									hideTrackNumber
									orderBy={false}
									songs={data.getTopTenSongs}
									className="MarginBottomHalf"
								/>
								<NavLink to="/top-one-hundred-songs">
									<Button
										transparent
										text="View All"
										icon="arrow_forward"
									/>
								</NavLink>
							</div>
						</Fragment>
					)}
				</div>
				{data && (
					<div>
						<h2 className="HeadingFive MarginBottomHalf">
							Your Recommendations
						</h2>
						<p className="BodyTwo">
							WIP
						</p>
					</div>
				)}
			</div>
		</Metadata>
	)
}

interface GetBrowsePageData {
	getTopTenSongs: Song[],
	getTrendingAlbums: Album[],
	getTrendingPlaylists: Playlist[],
}

export default BrowsePage