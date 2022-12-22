import { ArtistIDNameBase } from "@oly_op/musicloud-common/build/types";
import isEmpty from "lodash-es/isEmpty";
import { FC, Fragment, createElement } from "react";

import { createObjectPath } from "../../helpers";
import { OnClickPropTypes } from "../../types";
import ObjectLinks from "../object-links";

const FeaturingArtists: FC<PropTypes> = ({ song, onClick }) => (
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
);

interface PropTypesSong {
	artists: ArtistIDNameBase[];
	featuring: ArtistIDNameBase[];
}

interface PropTypes extends OnClickPropTypes {
	song: PropTypesSong;
}

export default FeaturingArtists;
