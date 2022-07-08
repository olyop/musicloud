import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { ChildrenProps } from "@oly_op/musicloud-common"

import "./index.scss"

const bem =
	createBEM("AlbumSongs")

const AlbumSongs: FC<PropTypes> = ({ onAddSong, children }) => (
	<div className="FlexColumnGapQuart">
		<p className={bem("label")}>
			Songs
		</p>
		<div className="Border Rounded PaddingHalf">
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

interface PropTypes extends ChildrenProps {
	onAddSong: OnAddSong,
}

export default AlbumSongs