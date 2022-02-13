import { isEmpty } from "lodash-es"
import { createElement, Fragment, VFC } from "react"
import { ArtistIDNameBase } from "@oly_op/music-app-common/types"

import ObjectLinks from "../object-links"
import { OnClickPropTypes } from "../../types"
import { createObjectPath } from "../../helpers"

const FeaturingArtists: VFC<PropTypes> = ({ song, onClick }) => (
	<Fragment>
		<ObjectLinks
			ampersand
			onClick={onClick}
			links={song.artists.map(({ artistID, name }) => ({
				text: name,
				path: `${createObjectPath("artist", artistID)}`,
			}))}
		/>
		{isEmpty(song.featuring) || (
			<Fragment>
				<Fragment> </Fragment>
				<span className="LightColor">
					<Fragment>feat. </Fragment>
					<ObjectLinks
						ampersand
						onClick={onClick}
						links={song.featuring.map(({ artistID, name }) => ({
							text: name,
							path: `${createObjectPath("artist", artistID)}`,
						}))}
					/>
				</span>
			</Fragment>
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