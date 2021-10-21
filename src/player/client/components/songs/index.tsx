import isEmpty from "lodash/isEmpty"
import { createElement, FC } from "react"
import { createBEM, BEMPropTypes } from "@oly_op/bem"

import Song from "../song"
import SelectOrderBy from "../select-order-by"
import { Handler, SettingsOrderBy, Song as SongType } from "../../types"

const bem =
	createBEM("Songs")

const Songs: FC<PropTypes> = ({
	onRemove,
	className,
	orderByKey,
	songs = [],
	orderByFields,
	hidePlay = false,
	hideMore = false,
	hidePlays = false,
	hideIndex = false,
	hideCover = false,
	hideOrderBy = false,
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
		{hideOrderBy || (
			<SelectOrderBy
				settingsKey={orderByKey!}
				fieldOptions={orderByFields!}
				className="PaddingHalf ItemBorder FlexListRight"
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

export interface OnCloseOptions {
	index: number,
	song: SongType,
}

interface PropTypes extends BEMPropTypes {
	songs?: SongType[],
	hidePlay?: boolean,
	hideMore?: boolean,
	hideCover?: boolean,
	hidePlays?: boolean,
	hideIndex?: boolean,
	hideOrderBy?: boolean,
	hideDuration?: boolean,
	hideElevated?: boolean,
	hideInLibrary?: boolean,
	orderByFields?: string[],
	hideTrackNumber?: boolean,
	onRemove?: (options: OnCloseOptions) => Handler,
	orderByKey?: keyof Pick<SettingsOrderBy, "songs" | "librarySongs">,
}

export default Songs