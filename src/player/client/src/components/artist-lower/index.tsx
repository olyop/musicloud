import { FC, Fragment, createElement } from "react";

import { createObjectPath, determinePlural } from "../../helpers";
import { Artist, Handler } from "../../types";
import ObjectLink from "../object-link";
import "./index.scss";

const ArtistLower: FC<PropTypes> = ({ onClick, artist: { artistID, songsTotal, albumsTotal } }) => {
	if (typeof albumsTotal === undefined && typeof songsTotal === undefined) {
		return null;
	} else {
		const albumsText = `${albumsTotal} album${determinePlural(albumsTotal)}`;
		const songsText = `${songsTotal} song${determinePlural(songsTotal)}`;
		return (
			<Fragment>
				<ObjectLink
					onClick={onClick}
					link={{
						text: albumsText,
						path: `${createObjectPath("artist", artistID)}/albums`,
					}}
				/>
				<Fragment>, </Fragment>
				<ObjectLink
					onClick={onClick}
					link={{
						text: songsText,
						path: `${createObjectPath("artist", artistID)}/songs`,
					}}
				/>
			</Fragment>
		);
	}
};

interface PropTypes {
	onClick?: Handler;
	artist: Pick<Artist, "artistID" | "songsTotal" | "albumsTotal">;
}

export default ArtistLower;
