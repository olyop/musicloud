import { createBEM } from "@oly_op/bem"
import { ChangeEventHandler, createElement, FC } from "react"

import "./index.scss"

const bem =
	createBEM("AlbumSongs")

const AlbumSongs: FC<PropTypes> = ({ onAddSong, children }) => {
	const handleChange: ChangeEventHandler<HTMLInputElement> =
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		({ target: { files } }) => onAddSong(files!.item(0)!)
	return (
		<div className="FlexColumnGapQuart">
			<p className={bem("label")}>
				Songs
			</p>
			<div className="Elevated PaddingHalf">
				<div>
					{children}
				</div>
				<input
					type="file"
					multiple={false}
					onChange={handleChange}
				/>
			</div>
		</div>
	)
}

interface PropTypes {
	onAddSong: (audio: File) => Promise<void>,
}

export default AlbumSongs