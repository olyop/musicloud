import { useFormik } from "formik"
import { createElement, FC, useState } from "react"

import Form from "../form"
import TextField from "../text-field"

interface Values {
	name: string,
}

const Genre: FC = () => {
	const [ loading, setLoading ] =
		useState(false)

	const formik =
		useFormik<Values>({
			initialValues: {
				name: "",
			},
			onSubmit: async values => {
				setLoading(true)
				const body = new FormData()
				body.append("name", values.name)
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
			onSubmit={formik.handleSubmit}
		>
			<TextField
				id="name"
				name="Name"
				type="text"
				placeholder="e.g. Dance"
				value={formik.values.name}
				onChange={formik.handleChange}
			/>
		</Form>
	)
}

export default Genre