import { ArtistIDNameBase } from "@oly_op/musicloud-common/build/types";
import isEmpty from "lodash-es/isEmpty";
import { FC, Fragment, createElement } from "react";

import { createObjectPath } from "../../helpers";
import { Handler, Song } from "../../types";
import ObjectLink from "../object-link";
import ObjectLinks from "../object-links";
import "./index.scss";

const SongTitle: FC<PropTypes> = ({ onClick, song: { mix, title, songID, remixers } }) => (
	<Fragment>
		<ObjectLink
			onClick={onClick}
			link={{
				text: title,
				path: createObjectPath("song", songID),
			}}
		/>
		<Fragment> </Fragment>
		{isEmpty(remixers) ? (
			<Fragment>
				{isEmpty(mix) || (
					<span className="LightColor LightWeight">
						{mix}
						<Fragment> Mix</Fragment>
					</span>
				)}
			</Fragment>
		) : (
			<span className="LightColor LightWeight">
				<ObjectLinks
					ampersand
					onClick={onClick}
					links={remixers.map(({ artistID, name }) => ({
						text: name,
						path: createObjectPath("artist", artistID),
					}))}
				/>
				<Fragment> </Fragment>
				{mix}
				<Fragment> Remix</Fragment>
			</span>
		)}
	</Fragment>
);

interface PropTypesSong extends Pick<Song, "mix" | "title" | "songID"> {
	remixers: ArtistIDNameBase[];
}

interface PropTypes {
	onClick?: Handler;
	song: PropTypesSong;
}

export default SongTitle;
