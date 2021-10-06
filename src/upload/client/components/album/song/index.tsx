import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC, ChangeEventHandler } from "react"

import AlbumSongList from "./list"
import { Item } from "../../../types"

import "./index.scss"

const bem =
	createBEM("AlbumSong")

const AlbumSong: FC<PropTypes> = ({
	song,
	onSongRemove,
	onSongListAdd,
	onTitleChange,
	onSongListChange,
}) => {
	const handleTitleChange: ChangeEventHandler<HTMLInputElement> =
		({ target: { value } }) =>
			onTitleChange(value)
	return (
		<div className={bem("", "ItemBorder PaddingHalf")}>
			<p className={bem("index", "BodyTwoBold")}>
				{song.trackNumber}
			</p>
			<div>
				<p className={bem("field-label")}>
					Title
				</p>
				<input
					type="text"
					value={song.title}
					onChange={handleTitleChange}
					className={bem("field-input")}
				/>
			</div>
			<div>
				<p className={bem("field-label")}>
					Artists
				</p>
				<AlbumSongList
					list={song.artists}
					onAdd={onSongListAdd("artists")}
					onChange={onSongListChange("artists")}
				/>
			</div>
			<div>
				<p className={bem("field-label")}>
					Featuring
				</p>
				<AlbumSongList
					list={song.featuring}
					onAdd={onSongListAdd("featuring")}
					onChange={onSongListChange("featuring")}
				/>
			</div>
			<div>
				<p className={bem("field-label")}>
					Remixers
				</p>
				<AlbumSongList
					list={song.remixers}
					onAdd={onSongListAdd("remixers")}
					onChange={onSongListChange("remixers")}
				/>
			</div>
			<div>
				<p className={bem("field-label")}>
					Genres
				</p>
				<AlbumSongList
					list={song.genres}
					onAdd={onSongListAdd("genres")}
					onChange={onSongListChange("genres")}
				/>
			</div>
			<Button
				transparent
				icon="close"
				onClick={onSongRemove}
				className={bem("field-remove")}
				iconClassName={bem("field-remove-icon")}
			/>
		</div>
	)
}

export interface ListsValues {
	genres: Item[],
	artists: Item[],
	remixers: Item[],
	featuring: Item[],
}

export interface Values extends ListsValues {
	mix: string,
	audio?: File,
	title: string,
	discNumber: number,
	trackNumber: number,
}

interface PropTypes {
	song: Values,
	onSongRemove: () => void,
	onTitleChange: (value: string) => void,
	onSongListAdd: (key: keyof ListsValues) => () => void,
	onSongListChange: (key: keyof ListsValues) => (index: number) => (value: string) => void,
}

export default AlbumSong