import isEmpty from "lodash/isEmpty"
import { createBEM } from "@oly_op/bem"
import { createElement, Fragment, VFC, MouseEventHandler } from "react"

import ObjectLinks from "../object-links"
import { useStatePlay } from "../../redux"
import { Song, Handler } from "../../types"
import { determineObjectPath } from "../../helpers"

import "./index.scss"

const bem =
	createBEM("SongTitle")

const SongTitle: VFC<PropTypes> = ({
	song,
	onClick,
	showRemixers = true,
}) => {
	const play = useStatePlay()
	const { mix, remixers } = song

	const handleClick: MouseEventHandler =
		event => {
			event.preventDefault()
			if (onClick) {
				void onClick()
			}
		}

	if (showRemixers) {
		return (
			<Fragment>
				<button
					type="button"
					onClick={handleClick}
					children={song.title}
					className={bem("title")}
					title={play ? "Pause" : "Play"}
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
					onClick={onClick}
					children={song.title}
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

interface PropTypes {
	song: Song,
	onClick?: Handler,
	showRemixers?: boolean,
}

export default SongTitle