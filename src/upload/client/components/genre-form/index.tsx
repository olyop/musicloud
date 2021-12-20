import { GenreBase } from "@oly_op/music-app-common/types"
import { useFormik } from "formik"
import { createElement, VFC, useState } from "react"

import Form from "../form"
import TextField from "../text-field"

type Genre =
	Pick<GenreBase, "name">

const GenreForm: VFC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const formik =
		useFormik<Genre>({
			initialValues: {
				name: "",
			},
			onSubmit: async genre => {
				setLoading(true)
				const body = new FormData()
				body.append("name", genre.name)
				try {
					await fetch("/upload/genre", { method: "POST", body })
				} finally {
					formik.resetForm()
					setLoading(false)
				}
			},
		})

	return (
		<Form
			title="Genre"
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
		</Form>
	)
}

export default GenreForm