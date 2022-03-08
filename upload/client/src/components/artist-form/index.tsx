import { useFormik } from "formik"
import { isEmpty } from "lodash-es"
import { ArtistBase } from "@oly_op/musicloud-common"
import { ChangeEventHandler, createElement, VFC, useState } from "react"

import Form from "../form"
import TextField from "../text-field"

interface ArtistImages {
	cover: File | null,
	profile: File | null,
}

interface Artist
	extends ArtistImages, Omit<ArtistBase, "artistID"> {
	city: string,
	country: string,
}

const searchURL =
	"https://google.com/search"

const ArtistForm: VFC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const formik =
		useFormik<Artist>({
			initialValues: {
				city: "",
				name: "",
				country: "",
				cover: null,
				profile: null,
			},
			onSubmit: async (artist, { resetForm }) => {
				if (artist.cover && artist.profile) {
					setLoading(true)
					const body = new FormData()
					body.append("name", artist.name)
					body.append("cover", artist.cover)
					body.append("profile", artist.profile)
					if (!isEmpty(artist.city) && !isEmpty(artist.country)) {
						body.append("city", artist.city)
						body.append("country", artist.country)
					}
					try {
						await fetch("/upload/artist", { method: "POST", body })
					} finally {
						resetForm()
						setLoading(false)
					}
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

	const { values, handleChange } = formik

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
				value={values.name}
				onChange={handleChange}
			/>
			<TextField
				id="city"
				name="City"
				type="text"
				placeholder="City"
				value={values.city}
				onChange={handleChange}
				action={{
					text: "City",
					icon: "search",
					url: `${searchURL}?q=${values.name.toLowerCase().replace(" ", "+")}+artist+origin+city`
				}}
			/>
			<TextField
				type="text"
				id="country"
				name="Country"
				placeholder="Country"
				value={values.country}
				onChange={handleChange}
				action={{
					icon: "search",
					text: "Country",
					url: `${searchURL}?q=${values.name.toLowerCase().replace(" ", "+")}+artist+origin+country`
				}}
			/>
			<TextField
				type="file"
				id="profile"
				name="Profile"
				multiple={false}
				image={values.profile || undefined}
				onChange={handlePhotoChange("profile")}
				action={values.profile ? undefined : {
					icon: "search",
					text: "Profile",
					url: `${searchURL}?q=${values.name.toLowerCase().replace(" ", "+")}+artist+profile&tbm=isch`
				}}
			/>
			<TextField
				id="cover"
				type="file"
				name="Cover"
				multiple={false}
				imageOrientation="landscape"
				image={values.cover || undefined}
				onChange={handlePhotoChange("cover")}
				action={values.cover ? undefined : {
					text: "Cover",
					icon: "search",
					url: `${searchURL}?q=${values.name.toLowerCase().replace(" ", "+")}+artist+photo&tbm=isch`
				}}
			/>
		</Form>
	)
}

export default ArtistForm