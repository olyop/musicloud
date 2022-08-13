import { useFormik } from "formik"
import orderBy from "lodash-es/orderBy"
import isEmpty from "lodash-es/isEmpty"
import isUndefined from "lodash-es/isUndefined"
import { useState, createElement, FC, ChangeEventHandler } from "react"

import Form from "../form"
import AlbumFormSong from "./song"
import { Item } from "../../types"
import TextField from "../text-field"
import AlbumSongs, { OnAddSong } from "./songs"
import createFormData from "./create-form-data"
import { Album, Song, SongLists } from "./types"
import getAudioMetadata from "./get-audio-metadata"
import { createGoogleSearchURL } from "../../helpers"

const AlbumForm: FC = () => {
	const [ loading, setLoading ] = useState(false)
	const [ songs, setSongs ] = useState<Song[]>([])

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
					await fetch("/api/upload/album", {
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

	const { values, errors, handleChange, handleSubmit, setFieldValue } = formik
	const { title, released, artists, remixers, cover } = values

	const handleSongAdd: OnAddSong =
		async files => {
			for (const audio of files) {
				const metadata = await getAudioMetadata(audio)

				if (isEmpty(title) && metadata.album) {
					await setFieldValue("title", metadata.album)
				}

				if (isEmpty(released) && metadata.year) {
					await setFieldValue("released", `${metadata.year}-01-01`)
				}

				if (isEmpty(artists) && metadata.artists) {
					await setFieldValue("artists", metadata.artists.map<Item>(
						(value, index) => ({ index, value }),
					))
				}

				if (isUndefined(cover) && metadata.cover) {
					await setFieldValue("cover", new Blob([new Uint8Array(metadata.cover.data)]))
				}

				setSongs(prevState => orderBy(
					[
						...prevState,
						{
							audio,
							mix: "",
							remixers: [],
							featuring: [],
							title: metadata.title || "",
							discNumber: metadata.discNumber || 1,
							trackNumber: metadata.trackNumber || 1,
							genres: metadata.genres?.map<Item>(
								(value, index) => ({ index, value }),
							) || [],
							artists: metadata.artists?.map<Item>(
								(value, index) => ({ index, value }),
							) || [],
						},
					],
					"trackNumber",
				))
			}
		}

	const handleSongRemove =
		(trackNumber: number) => () =>
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
			(value: string) =>
				setSongs(prevState => prevState.map(
					song => (
						song.trackNumber === trackNumber ? ({
							...song,
							title: value,
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

	const handleSongListRemove =
		(trackNumber: number) =>
			(key: keyof SongLists) =>
				(index: number) =>
					() =>
						setSongs(prevState => prevState.map(
							song => (
								song.trackNumber === trackNumber ? ({
									...song,
									[key]: song[key].filter(
										(item => item.index !== index),
									),
								}) : song
							),
						))

	const handleArtistAdd =
		(value: string) => () =>
			setFieldValue(
				"artists",
				[...artists, {
					value,
					index: artists.length,
				}],
			)

	const handleArtistRemove =
		(index: number) => () =>
			setFieldValue(
				"artists",
				artists.filter(
					artist => index !== artist.index,
				),
			)

	const handleRemixerAdd =
		(value: string) => () =>
			setFieldValue(
				"remixers",
				[...remixers, {
					value,
					index: remixers.length,
				}],
			)

	const handleRemixerRemove =
		(index: number) => () =>
			setFieldValue(
				"remixers",
				remixers.filter(
					remixer => index !== remixer.index,
				),
			)

	const handleCoverChange: ChangeEventHandler<HTMLInputElement> =
		({ target: { files } }) => {
			void setFieldValue("cover", files!.item(0))
		}

	return (
		<Form
			title="Album"
			errors={errors}
			loading={loading}
			onSubmit={handleSubmit}
		>
			<TextField
				id="title"
				type="text"
				name="Title"
				value={title}
				placeholder="Title"
				autoComplete="nope"
				onChange={handleChange}
			/>
			<TextField
				type="date"
				id="released"
				name="Released"
				value={released}
				onChange={handleChange}
				action={{
					icon: "search",
					text: "Released",
					disabled: isEmpty(title),
					url: createGoogleSearchURL({ query: `${title} album release date` }),
				}}
			/>
			<TextField
				id="artists"
				name="Artists"
				type="objects"
				list={artists}
				placeholder="Artist"
				onItemAdd={handleArtistAdd}
				onItemRemove={handleArtistRemove}
			/>
			<TextField
				id="remixers"
				type="objects"
				name="Remixers"
				list={remixers}
				placeholder="Remixers"
				onItemAdd={handleRemixerAdd}
				onItemRemove={handleRemixerRemove}
			/>
			<TextField
				id="cover"
				type="file"
				name="cover"
				image={cover}
				multiple={false}
				accept="image/*"
				onChange={handleCoverChange}
				action={cover ? undefined : {
					text: "Cover",
					icon: "search",
					disabled: isEmpty(title) || isEmpty(artists),
					url: createGoogleSearchURL({
						isImage: true,
						query: `${title} ${artists[0]?.value || ""} album cover`,
					}),
				}}
			/>
			<AlbumSongs onAddSong={handleSongAdd} songs={songs}>
				{songs.map(song => (
					<AlbumFormSong
						song={song}
						key={song.trackNumber}
						onSongRemove={handleSongRemove(song.trackNumber)}
						onSongListAdd={handleSongListAdd(song.trackNumber)}
						onMixChange={handleSongMixChange(song.trackNumber)}
						onTitleChange={handleSongTitleChange(song.trackNumber)}
						onSongListRemove={handleSongListRemove(song.trackNumber)}
						onSongListChange={handleSongListChange(song.trackNumber)}
					/>
				))}
			</AlbumSongs>
		</Form>
	)
}

export default AlbumForm