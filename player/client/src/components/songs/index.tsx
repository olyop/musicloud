import { isEmpty } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"

import Song from "../song"
import SelectOrderBy from "../select-order-by"
import { ClassNameBEMPropTypes, Handler, OrderByOptions, SettingsOrderBySongs, Song as SongType } from "../../types"

const bem =
	createBEM("Songs")

const Songs: VFC<SongsPropTypes> = ({
	onJump,
	onRemove,
	className,
	songs = [],
	orderBy = false,
	hidePlay = false,
	hidePlays = false,
	hideIndex = false,
	hideModal = false,
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
				alwaysList
				orderBy={orderBy}
				className="PaddingHalf ItemBorder FlexRowRight"
			/>
		)}
		{songs.map(
			(song, index) => (
				<Song
					song={song}
					hidePlay={hidePlay}
					hidePlays={hidePlays}
					hideCover={hideCover}
					hideModal={hideModal}
					hideDuration={hideDuration}
					hideInLibrary={hideInLibrary}
					hideTrackNumber={hideTrackNumber}
					className="ItemBorder PaddingHalf"
					key={song.songID + index.toString()}
					index={hideIndex ? undefined : index + 1}
					onJump={onJump && onJump({ index, song })}
					onRemove={onRemove && onRemove({ index, song })}
				/>
			),
		)}
	</div>
)

export interface SongChangeOptions {
	index: number,
	song: SongType,
}

export interface SongsPropTypes extends ClassNameBEMPropTypes {
	songs?: SongType[],
	hidePlay?: boolean,
	hideCover?: boolean,
	hidePlays?: boolean,
	hideIndex?: boolean,
	hideModal?: boolean,
	hideDuration?: boolean,
	hideElevated?: boolean,
	hideInLibrary?: boolean,
	hideTrackNumber?: boolean,
	onJump?: (options: SongChangeOptions) => Handler,
	onRemove?: (options: SongChangeOptions) => Handler,
	orderBy?: OrderByOptions<SettingsOrderBySongs> | false,
}

export default Songs