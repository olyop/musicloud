import {
	Route,
	Switch,
	useParams,
	RouteComponentProps,
} from "react-router-dom"

import {
	ImageSizes,
	ArtistIDBase,
	ImageDimensions,
} from "@oly_op/music-app-common/types"

import Button from "@oly_op/react-button"
import Metadata from "@oly_op/react-metadata"
import { createElement, Fragment, FC } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import {
	useQuery,
	useResetPlayer,
	useShuffleArtist,
	useToggleInLibrary,
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
import { updatePlay, useDispatch } from "../../redux"

const googleMapsBaseURL =
	"https://www.google.com.au/maps/search"

const ArtistFollowButton: FC<Data> = ({ artist }) => {
	const [ toggleInLibrary, inLibrary ] = useToggleInLibrary(artist)
	return (
		<Button
			onClick={toggleInLibrary}
			text={inLibrary ? "Following" : "Follow"}
			icon={inLibrary ? "library_add_check" : "library_add"}
		/>
	)
}

const ArtistPage: FC<RouteComponentProps> = ({ match }) => {
	const dispatch = useDispatch()
	const resetPlayer = useResetPlayer()
	const params = useParams<ArtistIDBase>()
	const artistID = addDashesToUUID(params.artistID)

	const { data, error } =
		useQuery<Data, ArtistIDBase>(GET_ARTIST_PAGE, { variables: { artistID } })

	const [ shuffleArtist ] =
		useShuffleArtist(artistID)

	const handleShuffle =
		async () => {
			resetPlayer()
			await shuffleArtist()
			dispatch(updatePlay(true))
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
		const { artist } = data
		const { name, city, country, playsTotal } = data.artist
		const cityURL = city.toLowerCase().replace(" ", "+")
		const countryURL = country.toLowerCase().replace(" ", "+")
		return (
			<Metadata title={name}>
				<Banner
					title={name}
					subTitle={determineArtistLower(artist)}
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
								artist={artist}
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
								{data.artist.firstAlbumReleaseDate.slice(0, -6)}
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
					basePath={match.url}
					className="PaddingTopHalf"
				/>
				<Switch>
					{routes.map(
						({ routeID, path, exact, component }) => (
							<Route
								key={routeID}
								exact={exact}
								component={component}
								path={match.url + path}
							/>
						),
					)}
				</Switch>
			</Metadata>
		)
	} else {
		return null
	}
}

interface Data {
	artist: Artist,
}

export default ArtistPage