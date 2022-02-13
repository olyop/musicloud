import { useFormik } from "formik"
import isEmpty from "lodash-es/isEmpty"
import { useState, createElement, VFC, ChangeEventHandler } from "react"

import Form from "../form"
import { Album } from "./types"
import AlbumSongs from "./songs"
import TextField from "../text-field"
import createFormData from "./create-form-data"
import AlbumFormSong, { Song, SongLists } from "./song"

const searchURL =
	"https://google.com/search"

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
				remixers: [],
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

	const { values, handleChange, setFieldValue } = formik

	const handleSongAdd =
		(audio: File) =>
			setSongs(prevState => [ ...prevState, {
				audio,
				mix: "",
				remixers: [],
				featuring: [],
				discNumber: 1,
				artists: values.artists,
				trackNumber: songs.length + 1,
				title: audio.name.slice(0, -4),
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
				setFieldValue(
					"artists",
					[...values.artists, {
						value,
						index: values.artists.length,
					}],
				)

	const handleArtistRemove =
		(index: number) =>
			() =>
				setFieldValue(
					"artists",
					values.artists.filter(
						artist => index !== artist.index,
					),
				)

	const handleRemixerAdd =
		(value: string) =>
			() =>
				setFieldValue(
					"remixers",
					[...values.remixers, {
						value,
						index: values.remixers.length,
					}],
				)

	const handleRemixerRemove =
		(index: number) =>
			() =>
				setFieldValue(
					"remixers",
					values.remixers.filter(
						remixer => index !== remixer.index,
					),
				)

	const handleCoverChange: ChangeEventHandler<HTMLInputElement> =
		({ target: { files } }) =>
			setFieldValue("cover", files!.item(0))

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
				value={values.title}
				onChange={handleChange}
			/>
			<TextField
				type="date"
				id="released"
				name="Released"
				value={values.released}
				onChange={handleChange}
				action={{
					icon: "search",
					text: "Released",
					url: `${searchURL}?q=${values.title.toLowerCase().replace(" ", "+")}+album+release+date`
				}}
			/>
			<TextField
				id="artists"
				name="Artists"
				type="objects"
				placeholder="Artist"
				list={values.artists}
				onItemAdd={handleArtistAdd}
				onItemRemove={handleArtistRemove}
			/>
			<TextField
				id="remixers"
				type="objects"
				name="Remixers"
				placeholder="Remixers"
				list={values.remixers}
				onItemAdd={handleRemixerAdd}
				onItemRemove={handleRemixerRemove}
			/>
			<TextField
				id="cover"
				type="file"
				name="cover"
				multiple={false}
				image={values.cover}
				onChange={handleCoverChange}
				action={values.cover ? undefined : {
					text: "Cover",
					icon: "search",
					url: `${searchURL}?q=${values.title.toLowerCase().replace(" ", "+")}+album+cover&tbm=isch`
				}}
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