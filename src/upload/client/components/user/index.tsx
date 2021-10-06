/* eslint-disable guard-for-in */
import { useFormik } from "formik"
import { ChangeEventHandler, createElement, FC, useState } from "react"

import Form from "../form"
import TextField from "../text-field"

interface ValuesImages {
	cover?: File,
	profile?: File,
}

interface Values extends ValuesImages {
	name: string,
	password: string,
}

const User: FC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const formik =
		useFormik<Values>({
			initialValues: {
				name: "Oliver",
				cover: undefined,
				profile: undefined,
				password: "password",
			},
			onSubmit: async values => {
				setLoading(true)
				const body = new FormData()
				body.append("name", values.name)
				body.append("cover", values.cover!)
				body.append("profile", values.profile!)
				body.append("password", values.password)
				try {
					await fetch("/upload/user", { method: "POST", body })
				} finally {
					formik.resetForm()
					setLoading(false)
				}
			},
		})

	const handlePhotoChange =
		(key: keyof ValuesImages): ChangeEventHandler<HTMLInputElement> =>
			({ target: { files } }) => {
				if (files) {
					formik.setFieldValue(key, files.item(0))
				}
			}

	return (
		<Form
			title="User"
			loading={loading}
			onSubmit={formik.handleSubmit}
		>
			<TextField
				id="name"
				name="Name"
				type="text"
				value={formik.values.name}
				onChange={formik.handleChange}
			/>
			<TextField
				id="password"
				name="Password"
				type="password"
				value={formik.values.password}
				onChange={formik.handleChange}
			/>
			<TextField
				type="file"
				id="profile"
				name="profile"
				multiple={false}
				imageOrientation="portrait"
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

export default User