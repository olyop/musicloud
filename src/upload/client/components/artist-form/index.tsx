import { useFormik } from "formik"
import { ArtistBase } from "@oly_op/music-app-common/types"
import { ChangeEventHandler, createElement, VFC, useState } from "react"

import Form from "../form"
import TextField from "../text-field"

interface ArtistImages {
	cover?: File,
	profile?: File,
}

interface Artist
	extends
	ArtistImages,
	Omit<ArtistBase, "artistID"> {}

const ArtistForm: VFC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const formik =
		useFormik<Artist>({
			initialValues: {
				city: "",
				name: "",
				country: "",
				cover: undefined,
				profile: undefined,
			},
			onSubmit: async artist => {
				setLoading(true)
				const body = new FormData()
				body.append("name", artist.name)
				body.append("city", artist.city)
				body.append("cover", artist.cover!)
				body.append("country", artist.country)
				body.append("profile", artist.profile!)
				try {
					await fetch("/upload/artist", { method: "POST", body })
				} finally {
					formik.resetForm()
					setLoading(false)
				}
			},
		})

	const handlePhotoChange =
		(key: keyof ArtistImages): ChangeEventHandler<HTMLInputElement> =>
			({ target: { files } }) => {
				if (files) {
					void formik.setFieldValue(key, files.item(0))
				}
			}

	return (
		<Form
			title="Artist"
			loading={loading}
			errors={formik.errors}
			onSubmit={formik.handleSubmit}
		>
			<TextField
				id="name"
				name="Name"
				type="text"
				placeholder="Name"
				value={formik.values.name}
				onChange={formik.handleChange}
			/>
			<TextField
				id="city"
				name="City"
				type="text"
				placeholder="City"
				value={formik.values.city}
				onChange={formik.handleChange}
			/>
			<TextField
				type="text"
				id="country"
				name="Country"
				placeholder="Country"
				value={formik.values.country}
				onChange={formik.handleChange}
			/>
			<TextField
				type="file"
				id="profile"
				name="Profile"
				multiple={false}
				image={formik.values.profile}
				onChange={handlePhotoChange("profile")}
			/>
			<TextField
				id="cover"
				type="file"
				name="Cover"
				multiple={false}
				image={formik.values.cover}
				imageOrientation="landscape"
				onChange={handlePhotoChange("cover")}
			/>
		</Form>
	)
}

export default ArtistForm