import isEmpty from "lodash/isEmpty"
import { createElement, Fragment, FC } from "react"

import ObjectLinks from "../object-links"
import { determineObjectPath } from "../../helpers"
import { Song, OnClickPropTypes } from "../../types"

const FeaturingArtists: FC<PropTypes> = ({ song, onClick }) => (
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

interface PropTypes extends OnClickPropTypes {
	song: Song,
}

export default FeaturingArtists