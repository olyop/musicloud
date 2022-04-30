import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"

import "./index.scss"

const bem =
	createBEM("AlbumSongs")

const AlbumSongs: FC<PropTypes> = ({ onAddSong, children }) => (
	<div className="FlexColumnGapQuart">
		<p className={bem("label")}>
			Songs
		</p>
		<div className="Elevated PaddingHalf">
			<div>
				{children}
			</div>
			<input
				multiple
				type="file"
				onChange={({ target: { files } }) => {
					void onAddSong(Array.from(files!))
				}}
			/>
		</div>
	</div>
)

export type OnAddSong =
	(files: File[]) => Promise<void>

interface PropTypes {
	onAddSong: OnAddSong,
}

export default AlbumSongs