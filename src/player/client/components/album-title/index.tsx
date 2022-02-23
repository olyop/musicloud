import { isEmpty } from "lodash-es"
import { createElement, Fragment, VFC } from "react"
import { ArtistIDNameBase } from "@oly_op/music-app-common/types"

import ObjectLink from "../object-link"
import ObjectLinks from "../object-links"
import { Handler, Album } from "../../types"
import { createObjectPath } from "../../helpers"
import { useStateShowReleased } from "../../redux"

const getYearFromReleased =
	({ released }: Pick<Album, "released">) => {
		const END_INDEX = 4
		return released.slice(0, END_INDEX)
	}

const AlbumTitle: VFC<PropTypes> = ({
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
						{getYearFromReleased({ released })}
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