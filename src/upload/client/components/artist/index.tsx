import { useFormik } from "formik"
import { ChangeEventHandler, createElement, FC, useState } from "react"

import Form from "../form"
import TextField from "../text-field"

interface ImageValues {
	cover?: File,
	profile?: File,
}

interface Values extends ImageValues {
	name: string,
	city: string,
	country: string,
}

const Artist: FC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const formik =
		useFormik<Values>({
			initialValues: {
				city: "",
				name: "",
				country: "",
				cover: undefined,
				profile: undefined,
			},
			onSubmit: async values => {
				setLoading(true)
				const body = new FormData()
				body.append("name", values.name)
				body.append("city", values.city)
				body.append("cover", values.cover!)
				body.append("country", values.country)
				body.append("profile", values.profile!)
				try {
					await fetch("/upload/artist", { method: "POST", body })
				} finally {
					formik.resetForm()
					setLoading(false)
				}
			},
		})

	const handlePhotoChange =
		(key: keyof ImageValues): ChangeEventHandler<HTMLInputElement> =>
			({ target: { files } }) => {
				if (files) {
					formik.setFieldValue(key, files.item(0))
				}
			}

	return (
		<Form
			title="Artist"
			loading={loading}
			onSubmit={formik.handleSubmit}
		>
			<TextField
				id="name"
				name="Name"
				type="text"
				placeholder="Tame Impala"
				value={formik.values.name}
				onChange={formik.handleChange}
			/>
			<TextField
				id="city"
				name="City"
				type="text"
				placeholder="Sydney"
				value={formik.values.city}
				onChange={formik.handleChange}
			/>
			<TextField
				type="text"
				id="country"
				name="Country"
				placeholder="Australia"
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

export default Artist