import { useParams, Route, Routes } from "react-router-dom"

import {
	ImageSizes,
	ArtistID,
	ImageDimensions,
} from "@oly_op/musicloud-common"

import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { createElement, Fragment, FC } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import {
	determinePlural,
	createObjectPath,
	createArtistLower,
	createCatalogImageURL,
} from "../../helpers"

import routes from "./routes"
import { Artist } from "../../types"
import Page from "../../components/page"
import Banner from "../../components/banner"
import Window from "../../components/window"
import ArtistFollowButton from "./follow-button"
import Navigation from "../../components/navigation"
import { useQuery, useShuffleArtist } from "../../hooks"
import createGoogleMapsURL from "./create-google-maps-url"

import GET_ARTIST_PAGE from "./get-artist-page.gql"

const ArtistPage: FC = () => {
	const params = useParams<keyof ArtistID>()
	const artistID = addDashesToUUID(params.artistID!)

	const { data, error } =
		useQuery<GetArtistData, ArtistID>(GET_ARTIST_PAGE, {
			variables: { artistID },
		})

	const [ shuffleArtist ] =
		useShuffleArtist({ artistID })

	if (error) {
		return (
			<h2 className="Content BodyOne PaddingTopBottom">
				{error.message === "Failed to fetch" ?
					error.message :
					"Artist does not exist."}
			</h2>
		)
	} else if (data) {
		const { name, city, country, playsTotal } =
			data.getArtistByID

		const handleShare =
			() => {
				void navigator.share({
					title: name,
					url: createObjectPath("artist", artistID),
				})
			}

		return (
			<Head pageTitle={name}>
				<Page>
					<Banner
						title={name}
						subTitle={createArtistLower(
							data.getArtistByID,
						)}
						profileURL={createCatalogImageURL(
							artistID,
							"profile",
							ImageSizes.HALF,
							ImageDimensions.SQUARE,
						)}
						coverURL={createCatalogImageURL(
							artistID,
							"cover",
							ImageSizes.FULL,
							ImageDimensions.LANDSCAPE,
						)}
						buttons={(
							<Fragment>
								<ArtistFollowButton
									artist={data.getArtistByID}
								/>
								<Window>
									{({ width }) => (
										<Fragment>
											<Button
												icon="shuffle"
												onClick={shuffleArtist}
												text={width > 700 ? "Shuffle" : undefined}
											/>
											<Button
												icon="share"
												onClick={handleShare}
												text={width > 700 ? "Share" : undefined}
											/>
										</Fragment>
									)}
								</Window>
							</Fragment>
						)}
						content={(
							<div className="FlexColumnGapQuart" style={{ alignItems: "flex-start" }}>
								<p className="BodyTwoInverted">
									<Fragment>Formed in </Fragment>
									{data.getArtistByID.since.slice(0, -6)}
								</p>
								{city && country && (
									<a
										target="_blank"
										rel="noreferrer"
										className="BodyTwoInverted"
										href={createGoogleMapsURL(data.getArtistByID)}
									>
										{city}
										<Fragment>, </Fragment>
										{country}
									</a>
								)}
								{playsTotal && (
									<p className=" BodyTwoInverted">
										{playsTotal.toLocaleString() ?? 0}
										<Fragment> play</Fragment>
										{determinePlural(playsTotal)}
									</p>
								)}
							</div>
						)}
					/>
					<Navigation
						routes={routes}
						className="PaddingTopHalf Content"
					/>
					<Routes>
						{routes.map(
							({ routeID, path, element }) => (
								<Route
									path={path}
									key={routeID}
									element={element}
								/>
							),
						)}
					</Routes>
				</Page>
			</Head>
		)
	} else {
		return null
	}
}

interface GetArtistData {
	getArtistByID: Artist,
}

export default ArtistPage