import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC, ChangeEventHandler } from "react"

import AlbumFormSongList from "./list"

import "./index.scss"
import { Song, SongLists } from "../types"

const bem =
	createBEM("AlbumFormSong")

const AlbumFormSong: FC<PropTypes> = ({
	song,
	onMixChange,
	onSongRemove,
	onSongListAdd,
	onTitleChange,
	onSongListChange,
	onSongListRemove,
}) => {
	const handleMixChange: ChangeEventHandler<HTMLInputElement> =
		event => onMixChange(event.target.value)
	const handleTitleChange: ChangeEventHandler<HTMLInputElement> =
		event => onTitleChange(event.target.value)
	return (
		<div className={bem("", "ItemBorder PaddingHalf")}>
			<p className={bem("index", "ParagraphTwoBold")}>
				{song.trackNumber}
			</p>
			<div>
				<p className={bem("field-label")}>
					Title
				</p>
				<input
					type="text"
					value={song.title}
					autoComplete="nope"
					onChange={handleTitleChange}
					className={bem("field-input")}
				/>
			</div>
			<div>
				<p className={bem("field-label")}>
					Mix
				</p>
				<input
					type="text"
					value={song.mix}
					onChange={handleMixChange}
					className={bem("field-input")}
				/>
			</div>
			<div>
				<p className={bem("field-label")}>
					Artists
				</p>
				<AlbumFormSongList
					list={song.artists}
					onAdd={onSongListAdd("artists")}
					onRemove={onSongListRemove("artists")}
					onChange={onSongListChange("artists")}
				/>
			</div>
			<div>
				<p className={bem("field-label")}>
					Featuring
				</p>
				<AlbumFormSongList
					list={song.featuring}
					onAdd={onSongListAdd("featuring")}
					onRemove={onSongListRemove("featuring")}
					onChange={onSongListChange("featuring")}
				/>
			</div>
			<div>
				<p className={bem("field-label")}>
					Remixers
				</p>
				<AlbumFormSongList
					list={song.remixers}
					onAdd={onSongListAdd("remixers")}
					onRemove={onSongListRemove("remixers")}
					onChange={onSongListChange("remixers")}
				/>
			</div>
			<div>
				<p className={bem("field-label")}>
					Genres
				</p>
				<AlbumFormSongList
					list={song.genres}
					onAdd={onSongListAdd("genres")}
					onRemove={onSongListRemove("genres")}
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

interface PropTypes {
	song: Song,
	onSongRemove: () => void,
	onMixChange: (value: string) => void,
	onTitleChange: (value: string) => void,
	onSongListAdd: (key: keyof SongLists) => () => void,
	onSongListRemove: (key: keyof SongLists) => (index: number) => () => void,
	onSongListChange: (key: keyof SongLists) => (index: number) => (value: string) => void,
}

export default AlbumFormSong