import Button from "@oly_op/react-button";
import isEmpty from "lodash-es/isEmpty";
import { FC, FormEventHandler, createElement, useState } from "react";

import Input, { InputOnChange } from "../input";

const DeleteAccountForm: FC<PropTypes> = ({ emailAddress, onEmailAddressChange }) => {
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState("");

	const handlePasswordChange: InputOnChange = value => {
		setPassword(value);
	};

	const handleDeleteAccount = async () => {
		setLoading(true);

		const body = {
			emailAddress,
			password,
		};

		const response = await fetch("/api/delete-account", {
			method: "POST",
			cache: "no-cache",
			body: JSON.stringify(body),
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			window.location.href = window.location.origin;
		} else {
			setError((await response.json()) as Error);
		}
	};

	const isValid = !isEmpty(password) && !isEmpty(emailAddress);

	const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
		event.preventDefault();
		if (isValid) {
			setError(null);
			void handleDeleteAccount();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="FlexColumnGap">
			<h1 className="HeadingFour">Delete Account</h1>
			<Input
				autoFocus
				name="Email"
				tabIndex={0}
				disabled={loading}
				spellCheck="false"
				autoComplete="email"
				value={emailAddress}
				inputID="emailAddress"
				onChange={onEmailAddressChange}
				placeholder="example@example.com"
			/>
			<Input
				autoFocus
				tabIndex={2}
				type="password"
				name="Password"
				value={password}
				inputID="current-password"
				autoComplete="new-password"
				placeholder="Current Password"
				onChange={handlePasswordChange}
			/>
			{error && <p className="ParagraphOne Error">{error.message}</p>}
			<Button
				type="submit"
				rightIcon="delete_forever"
				disabled={loading || !isValid}
				text={loading ? "Loading..." : "Delete Account"}
			/>
		</form>
	);
};

interface PropTypes {
	onClose: () => void;
	emailAddress: string;

	onEmailAddressChange: InputOnChange;
}

export default DeleteAccountForm;
