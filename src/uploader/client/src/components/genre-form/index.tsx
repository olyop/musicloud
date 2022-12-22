import { GenreBase } from "@oly_op/musicloud-common/build/types";
import { useFormik } from "formik";
import isEmpty from "lodash-es/isEmpty";
import { FC, createElement, useEffect, useState } from "react";

import Form from "../form";
import TextField, { CheckOptionsText, CheckOptionsValue } from "../text-field";

type Genre = Pick<GenreBase, "name">;

const GenreForm: FC = () => {
	const [loading, setLoading] = useState(false);

	const [checkNameLoading, setCheckNameLoading] = useState(false);
	const [checkNameText, setCheckNameText] = useState<CheckOptionsText>(null);
	const [checkNameValue, setCheckNameValue] = useState<CheckOptionsValue>(null);

	const formik = useFormik<Genre>({
		initialValues: {
			name: "",
		},
		onSubmit: async genre => {
			setLoading(true);
			const body = new FormData();
			body.append("name", genre.name);
			try {
				await fetch("/api/upload/genre", {
					method: "POST",
					body,
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authorization")!}`,
					},
				});
			} finally {
				formik.resetForm();
				setLoading(false);
			}
		},
	});

	const handleCheckNameExists = async () => {
		setCheckNameLoading(true);

		const url = new URL("/api/check/genre-name-exists", location.href);
		url.searchParams.append("name", formik.values.name);

		const requestInit: RequestInit = {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${localStorage.getItem("authorization")!}`,
			},
		};

		const response = await fetch(url, requestInit);

		if (response.ok) {
			const { exists } = (await response.json()) as { exists: boolean };

			if (exists) {
				setCheckNameText("Already exists");
			}

			setCheckNameValue(!exists);
		} else {
			setCheckNameValue(null);
		}

		setCheckNameLoading(false);
	};

	useEffect(() => {
		if (!isEmpty(formik.values.name)) {
			void handleCheckNameExists();
		}
		return () => {
			setCheckNameText(null);
			setCheckNameValue(null);
			setCheckNameLoading(false);
		};
	}, [formik.values.name]);

	return (
		<Form title="Genre" loading={loading} errors={formik.errors} onSubmit={formik.handleSubmit}>
			<TextField
				id="name"
				name="Name"
				type="text"
				placeholder="Name"
				autoComplete="nope"
				value={formik.values.name}
				onChange={formik.handleChange}
				check={{
					text: checkNameText,
					value: checkNameValue,
					loading: checkNameLoading,
				}}
			/>
		</Form>
	);
};

export default GenreForm;
