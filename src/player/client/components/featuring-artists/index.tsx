import isEmpty from "lodash/isEmpty"
import { createElement, Fragment, VFC } from "react"
import { ArtistIDNameBase } from "@oly_op/music-app-common/types"

import ObjectLinks from "../object-links"
import { OnClickPropTypes } from "../../types"
import { determineObjectPath } from "../../helpers"

const FeaturingArtists: VFC<PropTypes> = ({ song, onClick }) => (
	<Fragment>
		<ObjectLinks
			ampersand
			onClick={onClick}
			links={song.artists.map(({ artistID, name }) => ({
				text: name,
				path: `${determineObjectPath("artist", artistID)}`,
			}))}
		/>
		{isEmpty(song.featuring) || (
			<span className="LightColor">
				<Fragment> feat. </Fragment>
				<ObjectLinks
					ampersand
					onClick={onClick}
					links={song.featuring.map(({ artistID, name }) => ({
						text: name,
						path: `${determineObjectPath("artist", artistID)}`,
					}))}
				/>
			</span>
		)}
	</Fragment>
)

interface PropTypesSong {
	artists: ArtistIDNameBase[],
	featuring: ArtistIDNameBase[],
}

interface PropTypes extends OnClickPropTypes {
	song: PropTypesSong,
}

export default FeaturingArtists