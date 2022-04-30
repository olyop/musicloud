/* eslint-disable prefer-template */
import { useParams, Route, Routes } from "react-router-dom"

import {
	ImageSizes,
	ArtistID,
	ImageDimensions,
} from "@oly_op/musicloud-common"

import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { createElement, Fragment, FC } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import {
	useQuery,
	useShuffleArtist,
	useToggleObjectInLibrary,
} from "../../hooks"

import {
	determinePlural,
	createObjectPath,
	createArtistLower,
	createCatalogImageURL,
} from "../../helpers"

import routes from "./routes"
import { Artist } from "../../types"
import Banner from "../../components/banner"
import Window from "../../components/window"
import GET_ARTIST_PAGE from "./get-artist-page.gql"
import Navigation from "../../components/navigation"

const googleMapsBaseURL =
	"https://www.google.com.au/maps/search"

const createArtistGoogleMapsURL =
	(artist: Pick<Artist, "city" | "country">) => {
		const city = artist.city!.toLowerCase().replace(" ", "+")
		const country = artist.country!.toLowerCase().replace(" ", "+")
		return `${googleMapsBaseURL}/${city}+${country}`
	}

const ArtistFollowButton: FC<ArtistFollowButtonPropTypes> = ({ artist }) => {
	const [ toggleInLibrary, inLibrary, isError ] = useToggleObjectInLibrary(artist)
	return (
		<Button
			onClick={toggleInLibrary}
			text={inLibrary ? "Following" : "Follow"}
			icon={isError ? "warning" : (
				inLibrary ? "library_add_check" : "library_add"
			)}
		/>
	)
}

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
			<Metadata title={name}>
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
									href={createArtistGoogleMapsURL(data.getArtistByID)}
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
					className="PaddingTopHalf"
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
			</Metadata>
		)
	} else {
		return null
	}
}

interface GetArtistData {
	getArtistByID: Artist,
}

interface ArtistFollowButtonPropTypes {
	artist: Artist,
}

export default ArtistPage