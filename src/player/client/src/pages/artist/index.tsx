import { ArtistID, ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import { FC, Fragment, createElement } from "react";
import { Route, Routes, useParams } from "react-router-dom";

import Window from "../../components/window";
import {
	createArtistLower,
	createCatalogImageURL,
	determinePlural,
	formatPlays,
	formatTimestampToDate,
} from "../../helpers";
import { useQuery, useShuffleArtist } from "../../hooks";
import Banner from "../../layouts/banner";
import Navigation from "../../layouts/navigation";
import Page from "../../layouts/page";
import { Artist } from "../../types";
import createGoogleMapsURL from "./create-google-maps-url";
import ArtistFollowButton from "./follow-button";
import GET_ARTIST_PAGE from "./get-artist-page.gql";
import routes from "./routes";
import ShareButton from "./share-button";

const ArtistPage: FC = () => {
	const params = useParams<keyof ArtistID>();
	const artistID = addDashesToUUID(params.artistID!);

	const [shuffleArtist] = useShuffleArtist({ artistID });

	const { data, error } = useQuery<GetArtistData, ArtistID>(GET_ARTIST_PAGE, {
		variables: { artistID },
	});

	if (error) {
		return (
			<Page>
				<h2 className="Content ParagraphOne PaddingTopBottom">
					{error.message === "Failed to fetch" ? error.message : "Artist does not exist."}
				</h2>
			</Page>
		);
	} else if (data) {
		const { name, city, since, country, playsTotal } = data.getArtistByID;
		return (
			<Head pageTitle={name}>
				<Page>
					<Banner
						title={name}
						subTitle={createArtistLower(data.getArtistByID)}
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
						buttons={
							<Fragment>
								<ArtistFollowButton artist={data.getArtistByID} />
								<Window>
									{({ width }) => (
										<Fragment>
											<Button
												icon="shuffle"
												onClick={shuffleArtist}
												text={width > 700 ? "Shuffle" : undefined}
											/>
											<ShareButton width={width} artist={data.getArtistByID} />
										</Fragment>
									)}
								</Window>
							</Fragment>
						}
						content={
							<div className="FlexColumnGapQuart" style={{ alignItems: "flex-start" }}>
								<p className="ParagraphTwoInverted">
									<Fragment>Formed in </Fragment>
									{formatTimestampToDate(since)}
								</p>
								{city && country && (
									<a
										target="_blank"
										rel="noreferrer"
										className="Link ParagraphTwoInverted"
										href={createGoogleMapsURL(data.getArtistByID)}
									>
										{city}
										<Fragment>, </Fragment>
										{country}
									</a>
								)}
								{playsTotal && (
									<p className="ParagraphTwoInverted">
										{formatPlays(playsTotal)}
										<Fragment> play</Fragment>
										{determinePlural(playsTotal)}
									</p>
								)}
							</div>
						}
					/>
					<Navigation routes={routes} className="PaddingTopHalf Content" />
					<Routes>
						{routes.map(({ routeID, path, element }) => (
							<Route path={path} key={routeID} element={element} />
						))}
					</Routes>
				</Page>
			</Head>
		);
	} else {
		return <Page />;
	}
};

interface GetArtistData {
	getArtistByID: Artist;
}

export default ArtistPage;
