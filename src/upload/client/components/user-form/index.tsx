import { useFormik } from "formik"
import { ChangeEventHandler, createElement, VFC, useState } from "react"

import Form from "../form"
import TextField from "../text-field"
import createFormData from "./create-form-data"
import { User, UserImages } from "./types"

const UserForm: VFC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const formik =
		useFormik<User>({
			initialValues: {
				cover: undefined,
				profile: undefined,
				password: "password",
				name: "Oliver Plummer",
			},
			onSubmit: async (user, { resetForm, setErrors }) => {
				try {
					setLoading(true)
					await fetch("/upload/user", {
						method: "POST",
						body: createFormData(user),
					})
				} finally {
					resetForm()
					setLoading(false)
				}
			},
		})

	const handlePhotoChange =
		(key: keyof UserImages): ChangeEventHandler<HTMLInputElement> =>
			({ target: { files } }) => {
				if (files) {
					void formik.setFieldValue(key, files.item(0))
				}
			}

	return (
		<Form
			title="User"
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
				id="password"
				name="Password"
				type="password"
				placeholder="Password"
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

export default UserForm