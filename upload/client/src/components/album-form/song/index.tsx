import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { SongBase } from "@oly_op/musicloud-common"
import { createElement, VFC, ChangeEventHandler } from "react"

import { Item } from "../../../types"
import AlbumFormSongList from "./list"

import "./index.scss"

const bem =
	createBEM("AlbumFormSong")

const AlbumFormSong: VFC<PropTypes> = ({
	song,
	onMixChange,
	onSongRemove,
	onSongListAdd,
	onTitleChange,
	onSongListChange,
}) => {
	const handleMixChange: ChangeEventHandler<HTMLInputElement> =
		event => onMixChange(event.target.value)
	const handleTitleChange: ChangeEventHandler<HTMLInputElement> =
		event => onTitleChange(event.target.value)
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

interface SongAudio {
	audio?: File,
}

export interface SongLists {
	genres: Item[],
	artists: Item[],
	remixers: Item[],
	featuring: Item[],
}

export interface Song
	extends
	SongAudio,
	SongLists,
	Omit<SongBase, "bpm" | "songID" | "duration"> {}

interface PropTypes {
	song: Song,
	onSongRemove: () => void,
	onMixChange: (value: string) => void,
	onTitleChange: (value: string) => void,
	onSongListAdd: (key: keyof SongLists) => () => void,
	onSongListChange: (key: keyof SongLists) => (index: number) => (value: string) => void,
}

export default AlbumFormSong