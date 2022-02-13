import { isEmpty } from "lodash-es"
import { createElement, Fragment, VFC } from "react"
import { ArtistIDNameBase } from "@oly_op/music-app-common/types"

import ObjectLink from "../object-link"
import ObjectLinks from "../object-links"
import { Handler, Album } from "../../types"
import { createObjectPath } from "../../helpers"

const AlbumTitle: VFC<PropTypes> = ({
	onClick,
	album: { title, albumID, remixers },
}) => (
	<Fragment>
		<ObjectLink
			onClick={onClick}
			link={{ text: title, path: createObjectPath("album", albumID) }}
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
	</Fragment>
)

interface PropTypesAlbum
	extends Pick<Album, "title" | "albumID"> {
	remixers: ArtistIDNameBase[],
}

interface PropTypes {
	onClick?: Handler,
	album: PropTypesAlbum,
}

export default AlbumTitle