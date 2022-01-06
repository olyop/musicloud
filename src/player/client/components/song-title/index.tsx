import { isEmpty } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import { ArtistIDNameBase } from "@oly_op/music-app-common/types"
import { createElement, Fragment, VFC, MouseEventHandler } from "react"

import ObjectLinks from "../object-links"
import { usePlaySong } from "../../hooks"
import { Song, Handler } from "../../types"
import { determineObjectPath } from "../../helpers"
import { updatePlay, useDispatch } from "../../redux"

import "./index.scss"

const bem =
	createBEM("SongTitle")

const SongTitle: VFC<PropTypes> = ({
	onClick,
	showRemixers = true,
	song: { mix, title, songID, remixers },
}) => {
	const dispatch = useDispatch()
	const [ playSong, isPlaying ] = usePlaySong({ songID })

	const handleClick: MouseEventHandler =
		async event => {
			event.preventDefault()
			await playSong()
			dispatch(updatePlay(true))
			if (onClick) {
				void onClick()
			}
		}

	if (showRemixers) {
		return (
			<Fragment>
				<button
					type="button"
					children={title}
					onClick={handleClick}
					className={bem("title")}
					title={isPlaying ? "Pause" : "Play"}
				/>
				{isEmpty(remixers) ? (
					<Fragment>
						{isEmpty(mix) || (
							<span className="LightColor LightWeight">
								<Fragment> </Fragment>
								{mix}
								<Fragment> Mix</Fragment>
							</span>
						)}
					</Fragment>
				) : (
					<span className="LightColor LightWeight">
						<Fragment> </Fragment>
						<ObjectLinks
							ampersand
							onClick={onClick}
							links={remixers.map(({ artistID, name }) => ({
								text: name,
								path: determineObjectPath("artist", artistID),
							}))}
						/>
						<Fragment> </Fragment>
						{mix}
						<Fragment> Remix</Fragment>
					</span>
				)}
			</Fragment>
		)
	} else {
		return (
			<Fragment>
				<button
					type="button"
					children={title}
					onClick={onClick}
					className={bem("title")}
				/>
				{isEmpty(mix) || (
					<span className="LightColor LightWeight">
						<Fragment> - </Fragment>
						{mix}
						<Fragment> Mix</Fragment>
					</span>
				)}
			</Fragment>
		)
	}
}

interface PropTypesSong
	extends Pick<Song, "mix" | "title" | "songID"> {
	remixers: ArtistIDNameBase[],
}

interface PropTypes {
	onClick?: Handler,
	showRemixers?: boolean,
	song: PropTypesSong,
}

export default SongTitle