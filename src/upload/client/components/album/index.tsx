import { useFormik } from "formik"
import isEmpty from "lodash/isEmpty"
import { useState, createElement, FC, ChangeEventHandler } from "react"

import Form from "../form"
import AlbumSongs from "./songs"
import { Item } from "../../types"
import TextField from "../text-field"

import AlbumSong, {
	Values as SongValues,
	ListsValues as SongListsValues,
} from "./song"

interface Values {
	cover?: File,
	title: string,
	artists: Item[],
	released: string,
}

const Album: FC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const [ songs, setSongs ] =
		useState<SongValues[]>([])

	const formik =
		useFormik<Values>({
			initialValues: {
				title: "",
				artists: [],
				released: "",
				cover: undefined,
			},
			onSubmit: async values => {
				try {
					setLoading(true)
					const body = new FormData()
					body.append("title", values.title)
					body.append("cover", values.cover!)
					body.append("released", values.released)
					body.append("artists", JSON.stringify(values.artists))
					body.append("songs", JSON.stringify(songs.map(({ audio, ...song }) => song)))
					for (const song of songs) {
						body.append(`${song.trackNumber}-audio`, song.audio!)
					}
					await fetch("/upload/album", { method: "POST", body })
				} finally {
					setSongs([])
					formik.resetForm()
					setLoading(false)
				}
			},
		})

	const handleSongAdd =
		(audio: File) =>
			setSongs(prevState => [ ...prevState, {
				audio,
				mix: "",
				remixers: [],
				featuring: [],
				discNumber: 1,
				trackNumber: songs.length + 1,
				title: audio.name.slice(0, -4),
				artists: formik.values.artists,
				genres: isEmpty(prevState) ? [] : prevState[0].genres,
			}])

	const handleSongRemove =
		(trackNumber: number) =>
			() =>
				setSongs(prevState => prevState.filter(
					song => song.trackNumber !== trackNumber,
				))

	const handleSongTitleChange =
		(trackNumber: number) =>
			(title: string) =>
				setSongs(prevState => prevState.map(
					song => (
						song.trackNumber === trackNumber ? ({
							...song,
							title,
						}) : song
					),
				))

	const handleSongListAdd =
		(trackNumber: number) =>
			(key: keyof SongListsValues) =>
				() =>
					setSongs(prevState => prevState.map(
						song => (
							song.trackNumber === trackNumber ? ({
								...song,
								[key]: [
									...song[key],
									{ index: song[key].length, value: "" },
								],
							}) : song
						),
					))

	const handleSongListChange =
		(trackNumber: number) =>
			(key: keyof SongListsValues) =>
				(index: number) =>
					(value: string) =>
						setSongs(prevState => prevState.map(
							song => (
								song.trackNumber === trackNumber ? ({
									...song,
									[key]: song[key].map(
										(item => (item.index === index ? { index, value } : item)),
									),
								}) : song
							),
						))

	const handleArtistAdd =
		(value: string) =>
			() => {
				formik.setFieldValue(
					"artists",
					[...formik.values.artists, {
						value,
						index: formik.values.artists.length,
					}],
				)
			}

	const handleArtistRemove =
		(index: number) =>
			() => {
				formik.setFieldValue(
					"artists",
					formik.values.artists.filter(artist => index !== artist.index),
				)
			}

	const handleCoverChange: ChangeEventHandler<HTMLInputElement> =
		({ target: { files } }) => {
			if (files) {
				formik.setFieldValue("cover", files.item(0))
			}
		}

	return (
		<Form
			title="Album"
			loading={loading}
			onSubmit={formik.handleSubmit}
		>
			<TextField
				id="title"
				type="text"
				name="Title"
				placeholder="e.g. Currents"
				value={formik.values.title}
				onChange={formik.handleChange}
			/>
			<TextField
				type="date"
				id="released"
				name="Released"
				value={formik.values.released}
				onChange={formik.handleChange}
			/>
			<TextField
				id="cover"
				type="file"
				name="cover"
				multiple={false}
				image={formik.values.cover}
				onChange={handleCoverChange}
			/>
			<TextField
				id="artists"
				name="Artists"
				type="objects"
				onItemAdd={handleArtistAdd}
				list={formik.values.artists}
				placeholder="e.g. Tame Impala"
				onItemRemove={handleArtistRemove}
			/>
			<AlbumSongs onAddSong={handleSongAdd}>
				{isEmpty(songs) ? (
					<p className="BodyOne PaddingHalf">
						No songs...
					</p>
				) : (
					songs.map(
						song => (
							<AlbumSong
								song={song}
								key={song.trackNumber}
								onSongRemove={handleSongRemove(song.trackNumber)}
								onSongListAdd={handleSongListAdd(song.trackNumber)}
								onTitleChange={handleSongTitleChange(song.trackNumber)}
								onSongListChange={handleSongListChange(song.trackNumber)}
							/>
						),
					)
				)}
			</AlbumSongs>
		</Form>
	)
}

export default Album