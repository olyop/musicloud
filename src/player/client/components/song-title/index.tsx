import { isEmpty } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import { ArtistIDNameBase } from "@oly_op/music-app-common/types"
import { createElement, Fragment, VFC, MouseEventHandler } from "react"

import ObjectLinks from "../object-links"
import { usePlaySong } from "../../hooks"
import { Song, Handler } from "../../types"
import { createObjectPath } from "../../helpers"
import { updatePlay, useDispatch } from "../../redux"

import "./index.scss"
import ObjectLink from "../object-link"

const bem =
	createBEM("SongTitle")

const SongTitle: VFC<PropTypes> = ({
	onClick,
	noLink = false,
	song: { mix, title, songID, remixers },
}) => {
	const dispatch = useDispatch()
	const [ playSong, isPlaying ] = usePlaySong({ songID })

	const handleClick: MouseEventHandler =
		async event => {
			event.preventDefault()
			if (!noLink) {
				await playSong()
				dispatch(updatePlay(true))
			}
			if (onClick) {
				void onClick()
			}
		}

	const titleElement = noLink ? (
		<ObjectLink
			onClick={onClick}
			link={{ text: title, path: createObjectPath("song", songID) }}
		/>
	) : (
		<button
			type="button"
			children={title}
			onClick={handleClick}
			className={bem("title")}
			title={isPlaying ? "Pause" : "Play"}
		/>
	)

	return (
		<Fragment>
			{titleElement}
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
	)
}

interface PropTypesSong
	extends Pick<Song, "mix" | "title" | "songID"> {
	remixers: ArtistIDNameBase[],
}

interface PropTypes {
	noLink?: boolean,
	onClick?: Handler,
	song: PropTypesSong,
}

export default SongTitle