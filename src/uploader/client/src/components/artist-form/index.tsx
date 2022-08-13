import { useFormik } from "formik"
import isEmpty from "lodash-es/isEmpty"
import { ArtistBase } from "@oly_op/musicloud-common/build/types"
import { ChangeEventHandler, createElement, FC, useEffect, useState } from "react"

import Form from "../form"
import { createGoogleSearchURL } from "../../helpers"
import TextField, { CheckOptionsText, CheckOptionsValue } from "../text-field"

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
	const [ loading, setLoading ] =	useState(false)

	const [ checkNameLoading, setCheckNameLoading ] = useState(false)
	const [ checkNameText, setCheckNameText ] = useState<CheckOptionsText>(null)
	const [ checkNameValue, setCheckNameValue ] = useState<CheckOptionsValue>(null)

	const [ checkCountryLoading, setCheckCountryLoading ] = useState(false)
	const [ checkCountryValue, setCheckCountryValue ] = useState<CheckOptionsValue>(null)

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
						await fetch("/api/upload/artist", { method: "POST", body })
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

	const handleCheckNameExists =
		async () => {
			setCheckNameLoading(true)

			const url = new URL("/api/check/artist-name-exists", location.href)
			url.searchParams.append("name", name)

			const requestInit: RequestInit = {
				method: "GET",
				headers: {
					Accept: "application/json",
				},
			}

			const response =
				await fetch(url, requestInit)

			const { exists } =
				await response.json() as { exists: boolean }

			if (exists) {
				setCheckNameText("Already exists")
			}

			setCheckNameLoading(false)
			setCheckNameValue(!exists)
		}

	useEffect(() => {
		if (!isEmpty(name)) {
			void handleCheckNameExists()
		}
		return () => {
			setCheckNameText(null)
			setCheckNameValue(null)
			setCheckNameLoading(false)
		}
	}, [name])

	const handleCheckCountryExists =
		async () => {
			setCheckCountryLoading(true)

			const url = new URL("/api/check/country-exists", location.href)
			url.searchParams.append("name", country)

			const requestInit: RequestInit = {
				method: "GET",
				headers: {
					Accept: "application/json",
				},
			}

			const response =
				await fetch(url, requestInit)

			const { exists } =
				await response.json() as { exists: boolean }

			setCheckCountryLoading(false)
			setCheckCountryValue(exists)
		}

	useEffect(() => {
		if (!isEmpty(country)) {
			void handleCheckCountryExists()
		}
		return () => {
			setCheckCountryValue(null)
			setCheckCountryLoading(false)
		}
	}, [country])

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
				check={{
					text: checkNameText,
					value: checkNameValue,
					loading: checkNameLoading,
				}}
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
						query: `${name} artist origin city`,
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
				check={{
					value: checkCountryValue,
					loading: checkCountryLoading,
				}}
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
				accept="image/*"
				image={profile || undefined}
				onChange={handlePhotoChange("profile")}
				action={profile ? undefined : {
					icon: "search",
					text: "Profile",
					disabled: isEmpty(name),
					url: createGoogleSearchURL({ isImage: true, query: `${name} artist profile image` }),
				}}
			/>
			<TextField
				id="cover"
				type="file"
				name="Cover"
				multiple={false}
				accept="image/*"
				image={cover || undefined}
				imageOrientation="landscape"
				onChange={handlePhotoChange("cover")}
				action={cover ? undefined : {
					text: "Cover",
					icon: "search",
					disabled: isNameEmpty,
					url: createGoogleSearchURL({ isImage: true, query: `${name} artist cover image` }),
				}}
			/>
		</Form>
	)
}

export default ArtistForm