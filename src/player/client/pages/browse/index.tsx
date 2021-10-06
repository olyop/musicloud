import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC, Fragment } from "react"
import { NavLink } from "react-router-dom"
import Metadata from "@oly_op/react-metadata"

import { useQuery } from "../../hooks"
import { Song, Album } from "../../types"
import Songs from "../../components/songs"
import Albums from "../../components/albums"
import GET_BROWSE_PAGE from "./get-browse-page.gql"

import "./index.scss"

const bem =
	createBEM("BrowsePage")

const BrowsePage: FC = () => {
	const { data } = useQuery<Data>(GET_BROWSE_PAGE)
	return (
		<Metadata title="Home">
			<div className="Content PaddingTopBottom">
				<div className={bem("", "MarginBottom")}>
					{data && (
						<Fragment>
							<div>
								<h2 className="HeadingFive MarginBottomHalf">
									Trending
								</h2>
								<Albums
									hideModal
									alwaysList
									hideOrderBy
									albums={data.trendingAlbums}
									className="MarginBottomHalf"
								/>
								<Button
									transparent
									text="View All"
									icon="arrow_forward"
								/>
							</div>
							<div>
								<h2 className="HeadingFive MarginBottomHalf">
									Top Ten Songs
								</h2>
								<Songs
									hideMore
									hideCover
									hideIndex
									hideOrderBy
									hideDuration
									hideInLibrary
									hideTrackNumber
									songs={data.topTenSongs}
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
				<div>
					<h2 className="HeadingFive MarginBottomHalf">
						Your Recommendations
					</h2>
				</div>
			</div>
		</Metadata>
	)
}

interface Data {
	topTenSongs: Song[],
	trendingAlbums: Album[],
}

export default BrowsePage