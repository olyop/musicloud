import { useParams, Route, Routes } from "react-router-dom"

import {
	ImageSizes,
	ArtistID,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { createElement, Fragment, VFC } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import {
	useQuery,
	useResetPlayer,
	useShuffleArtist,
	useToggleObjectInLibrary,
} from "../../hooks"

import {
	determinePlural,
	determineArtistLower,
	determineCatalogImageURL,
} from "../../helpers"

import routes from "./routes"
import { Artist } from "../../types"
import Banner from "../../components/banner"
import GET_ARTIST_PAGE from "./get-artist-page.gql"
import Navigation from "../../components/navigation"

const googleMapsBaseURL =
	"https://www.google.com.au/maps/search"

const ArtistFollowButton: VFC<ArtistFollowButtonPropTypes> = ({ artist }) => {
	const [ toggleInLibrary, inLibrary ] = useToggleObjectInLibrary(artist)
	return (
		<Button
			onClick={toggleInLibrary}
			text={inLibrary ? "Following" : "Follow"}
			icon={inLibrary ? "library_add_check" : "library_add"}
		/>
	)
}

const ArtistPage: VFC = () => {
	const resetPlayer = useResetPlayer()
	const params = useParams<keyof ArtistID>()
	const artistID = addDashesToUUID(params.artistID!)

	const { data, error } =
		useQuery<GetArtistData, ArtistID>(GET_ARTIST_PAGE, {
			variables: { artistID },
		})

	const [ shuffleArtist ] =
		useShuffleArtist({ artistID })

	const handleShuffle =
		async () => {
			resetPlayer()
			await shuffleArtist()
		}

	if (error) {
		return (
			<h2 className="Content BodyOne PaddingTopBottom">
				{error.message === "Failed to fetch" ?
					error.message :
					"Artist does not exist."}
			</h2>
		)
	} else if (data) {
		const { name, city, country, playsTotal } = data.getArtistByID
		const cityURL = city.toLowerCase().replace(" ", "+")
		const countryURL = country.toLowerCase().replace(" ", "+")
		return (
			<Metadata title={name}>
				<Banner
					title={name}
					subTitle={determineArtistLower(data.getArtistByID)}
					profileURL={determineCatalogImageURL(
						artistID,
						"profile",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					)}
					coverURL={determineCatalogImageURL(
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
							<Button
								icon="shuffle"
								text="Shuffle"
								onClick={handleShuffle}
							/>
						</Fragment>
					)}
					content={(
						<Fragment>
							<p className="BodyTwoInverted MarginTopQuart">
								<Fragment>Formed in </Fragment>
								{data.getArtistByID.since.slice(0, -6)}
							</p>
							{city && country && (
								<a
									target="_blank"
									rel="noreferrer"
									style={{ display: "inline-block" }}
									className="BodyTwoInverted MarginTopQuart"
									href={`${googleMapsBaseURL}/${cityURL}+${countryURL}`}
								>
									{city}
									<Fragment>, </Fragment>
									{country}
								</a>
							)}
							{playsTotal && (
								<p className=" BodyTwoInverted MarginTopQuart">
									{playsTotal.toLocaleString() ?? 0}
									<Fragment> play</Fragment>
									{determinePlural(playsTotal)}
								</p>
							)}
						</Fragment>
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