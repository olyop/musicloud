import { ArtistIDNameBase } from "@oly_op/musicloud-common/build/types";
import isEmpty from "lodash-es/isEmpty";
import { FC, Fragment, createElement } from "react";

import { createObjectPath } from "../../helpers";
import { useStateShowReleased } from "../../redux";
import { Album, Handler } from "../../types";
import ObjectLink from "../object-link";
import ObjectLinks from "../object-links";

const releasedYearFormatter = new Intl.DateTimeFormat("en", { year: "numeric" });

const AlbumTitle: FC<PropTypes> = ({
	onClick,
	hideReleased = false,
	album: { title, albumID, remixers, released },
}) => {
	const showReleased = useStateShowReleased();
	return (
		<Fragment>
			<ObjectLink
				onClick={onClick}
				link={{
					text: title,
					path: createObjectPath("album", albumID),
				}}
			/>
			{isEmpty(remixers) ? null : (
				<Fragment>
					<Fragment> </Fragment>
					<span className="LightColor LightWeight">
						<ObjectLinks
							ampersand
							onClick={onClick}
							links={remixers.map(({ artistID, name }) => ({
								text: name,
								path: createObjectPath("artist", artistID),
							}))}
						/>
						<Fragment> Remix</Fragment>
					</span>
				</Fragment>
			)}
			{!hideReleased && showReleased && (
				<Fragment>
					<Fragment> </Fragment>
					<span className="LightColor LightWeight">
						<Fragment>(</Fragment>
						{releasedYearFormatter.format(released)}
						<Fragment>)</Fragment>
					</span>
				</Fragment>
			)}
		</Fragment>
	);
};

interface PropTypesAlbum extends Pick<Album, "title" | "albumID" | "released"> {
	remixers: ArtistIDNameBase[];
}

interface PropTypes {
	onClick?: Handler;
	album: PropTypesAlbum;
	hideReleased?: boolean;
}

export default AlbumTitle;
