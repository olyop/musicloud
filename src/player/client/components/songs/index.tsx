import isEmpty from "lodash/isEmpty"
import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"

import Song from "../song"
import SelectOrderBy from "../select-order-by"
import { ClassNameBEMPropTypes, Handler, OrderByOptions, SettingsOrderBySongs, Song as SongType } from "../../types"

const bem =
	createBEM("Songs")

const Songs: VFC<SongsPropTypes> = ({
	onRemove,
	className,
	songs = [],
	orderBy = false,
	hidePlay = false,
	hideMore = false,
	hidePlays = false,
	hideIndex = false,
	hideCover = false,
	hideDuration = false,
	hideElevated = false,
	hideInLibrary = false,
	hideTrackNumber = false,
}) => (
	<div
		className={bem(
			className,
			(isEmpty(songs) || hideElevated) || "Elevated",
		)}
	>
		{orderBy && (
			<SelectOrderBy
				orderBy={orderBy}
				className="PaddingHalf ItemBorder FlexRowRight"
			/>
		)}
		{songs.map(
			(song, index) => (
				<Song
					song={song}
					hidePlay={hidePlay}
					hideMore={hideMore}
					hidePlays={hidePlays}
					hideCover={hideCover}
					hideDuration={hideDuration}
					hideInLibrary={hideInLibrary}
					hideTrackNumber={hideTrackNumber}
					className="ItemBorder PaddingHalf"
					key={song.songID + index.toString()}
					index={hideIndex ? undefined : index + 1}
					onRemove={onRemove && onRemove({ index, song })}
				/>
			),
		)}
	</div>
)

export interface OnRemoveOptions {
	index: number,
	song: SongType,
}

export interface SongsPropTypes extends ClassNameBEMPropTypes {
	songs?: SongType[],
	hidePlay?: boolean,
	hideMore?: boolean,
	hideCover?: boolean,
	hidePlays?: boolean,
	hideIndex?: boolean,
	hideDuration?: boolean,
	hideElevated?: boolean,
	hideInLibrary?: boolean,
	hideTrackNumber?: boolean,
	onRemove?: (options: OnRemoveOptions) => Handler,
	orderBy?: OrderByOptions<SettingsOrderBySongs> | false,
}

export default Songs