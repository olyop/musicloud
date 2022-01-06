import { useFormik } from "formik"
import isEmpty from "lodash/isEmpty"
import { useState, createElement, VFC, ChangeEventHandler } from "react"

import Form from "../form"
import { Album } from "./types"
import AlbumSongs from "./songs"
import TextField from "../text-field"
import AlbumFormSong, { Song, SongLists } from "./song"
import createFormData from "./create-form-data"

const AlbumForm: VFC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const [ songs, setSongs ] =
		useState<Song[]>([])

	const formik =
		useFormik<Album>({
			initialValues: {
				title: "",
				artists: [],
				released: "",
				cover: undefined,
			},
			onSubmit: async (album, { resetForm }) => {
				let reset = true
				try {
					setLoading(true)
					await fetch("/upload/album", {
						method: "POST",
						body: createFormData(album, songs),
					})
				} catch (error) {
					console.error(error)
					reset = false
				} finally {
					if (reset) {
						setSongs([])
						resetForm()
					}
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
				genres: isEmpty(prevState) ? [] : prevState[0]!.genres,
			}])

	const handleSongRemove =
		(trackNumber: number) =>
			() =>
				setSongs(prevState => prevState.filter(
					song => song.trackNumber !== trackNumber,
				))

	const handleSongMixChange =
		(trackNumber: number) =>
			(mix: string) =>
				setSongs(prevState => prevState.map(
					song => (
						song.trackNumber === trackNumber ? ({
							...song,
							mix,
						}) : song
					),
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
			(key: keyof SongLists) =>
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
			(key: keyof SongLists) =>
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
			() =>
				formik.setFieldValue(
					"artists",
					[...formik.values.artists, {
						value,
						index: formik.values.artists.length,
					}],
				)

	const handleArtistRemove =
		(index: number) =>
			() =>
				formik.setFieldValue(
					"artists",
					formik.values.artists.filter(
						artist => index !== artist.index,
					),
				)

	const handleCoverChange: ChangeEventHandler<HTMLInputElement> =
		({ target: { files } }) =>
			formik.setFieldValue("cover", files!.item(0))

	return (
		<Form
			title="Album"
			loading={loading}
			errors={formik.errors}
			onSubmit={formik.handleSubmit}
		>
			<TextField
				id="title"
				type="text"
				name="Title"
				placeholder="Title"
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
				id="artists"
				name="Artists"
				type="objects"
				placeholder="Artist"
				onItemAdd={handleArtistAdd}
				list={formik.values.artists}
				onItemRemove={handleArtistRemove}
			/>
			<TextField
				id="cover"
				type="file"
				name="cover"
				multiple={false}
				image={formik.values.cover}
				onChange={handleCoverChange}
			/>
			<AlbumSongs onAddSong={handleSongAdd}>
				{isEmpty(songs) ? (
					<p className="BodyOne PaddingHalf">
						No songs...
					</p>
				) : (
					songs.map(
						song => (
							<AlbumFormSong
								song={song}
								key={song.trackNumber}
								onSongRemove={handleSongRemove(song.trackNumber)}
								onSongListAdd={handleSongListAdd(song.trackNumber)}
								onMixChange={handleSongMixChange(song.trackNumber)}
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

export default AlbumForm