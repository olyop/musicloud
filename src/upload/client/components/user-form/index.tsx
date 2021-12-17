import { UserBase } from "@oly_op/music-app-common/types"
import { useFormik } from "formik"
import { ChangeEventHandler, createElement, VFC, useState } from "react"

import Form from "../form"
import TextField from "../text-field"

interface UserImages {
	cover?: File,
	profile?: File,
}

interface UserPassword {
	password: string,
}

interface User
	extends Pick<UserBase, "name">, UserPassword, UserImages {}

const UserForm: VFC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const formik =
		useFormik<User>({
			initialValues: {
				name: "Oliver",
				cover: undefined,
				profile: undefined,
				password: "password",
			},
			onSubmit: async user => {
				setLoading(true)
				const body = new FormData()
				body.append("name", user.name)
				body.append("cover", user.cover!)
				body.append("profile", user.profile!)
				body.append("password", user.password)
				try {
					await fetch("/upload/user", { method: "POST", body })
				} finally {
					formik.resetForm()
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