import { useFormik } from "formik"
import { isEmpty } from "lodash-es"
import { ArtistBase } from "@oly_op/musicloud-common"
import { ChangeEventHandler, createElement, FC, useState } from "react"

import Form from "../form"
import TextField from "../text-field"
import { createGoogleSearchURL } from "../../helpers"

interface ArtistImages {
	cover: File | null,
	profile: File | null,
}

interface Artist
	extends ArtistImages, Omit<ArtistBase, "artistID"> {
	city: string,
	country: string,
}

const ArtistForm: FC = () => {
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

	const { values, errors, handleChange, handleSubmit } = formik
	const { name, city, country, cover, profile } = values

	const isNameEmpty = isEmpty(name)

	return (
		<Form
			title="Artist"
			errors={errors}
			loading={loading}
			onSubmit={handleSubmit}
		>
			<TextField
				id="name"
				name="Name"
				type="text"
				value={name}
				placeholder="Name"
				autoComplete="nope"
				onChange={handleChange}
			/>
			<TextField
				id="city"
				name="City"
				type="text"
				value={city}
				placeholder="City"
				onChange={handleChange}
				action={{
					text: "City",
					icon: "search",
					disabled: isNameEmpty,
					url: createGoogleSearchURL({
						query: `${name} artist origin`,
					}),
				}}
			/>
			<TextField
				type="text"
				id="country"
				name="Country"
				value={country}
				placeholder="Country"
				onChange={handleChange}
				action={{
					icon: "search",
					text: "Country",
					disabled: isNameEmpty,
					url: createGoogleSearchURL({ query: `${name} artist origin country` }),
				}}
			/>
			<TextField
				type="file"
				id="profile"
				name="Profile"
				multiple={false}
				image={profile || undefined}
				onChange={handlePhotoChange("profile")}
				action={profile ? undefined : {
					icon: "search",
					text: "Profile",
					disabled: isEmpty(name),
					url: createGoogleSearchURL({ isImage: true, query: `${name} artist profile` }),
				}}
			/>
			<TextField
				id="cover"
				type="file"
				name="Cover"
				multiple={false}
				image={cover || undefined}
				imageOrientation="landscape"
				onChange={handlePhotoChange("cover")}
				action={cover ? undefined : {
					text: "Cover",
					icon: "search",
					disabled: isNameEmpty,
					url: createGoogleSearchURL({ isImage: true, query: `${name} artist cover` }),
				}}
			/>
		</Form>
	)
}

export default ArtistForm