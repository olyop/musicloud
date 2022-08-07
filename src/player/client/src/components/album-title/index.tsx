import isEmpty from "lodash-es/isEmpty"
import { createElement, Fragment, FC } from "react"
import { ArtistIDNameBase } from "@oly_op/musicloud-common/build/types"

import ObjectLink from "../object-link"
import ObjectLinks from "../object-links"
import { Handler, Album } from "../../types"
import { createObjectPath } from "../../helpers"
import { useStateShowReleased } from "../../redux"

const AlbumTitle: FC<PropTypes> = ({
	onClick,
	hideReleased = false,
	album: { title, albumID, remixers, released },
}) => {
	const showReleased = useStateShowReleased()
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
						{released.slice(0, 4)}
						<Fragment>)</Fragment>
					</span>
				</Fragment>
			)}
		</Fragment>
	)
}

interface PropTypesAlbum
	extends Pick<Album, "title" | "albumID" | "released"> {
	remixers: ArtistIDNameBase[],
}

interface PropTypes {
	onClick?: Handler,
	album: PropTypesAlbum,
	hideReleased?: boolean,
}

export default AlbumTitle