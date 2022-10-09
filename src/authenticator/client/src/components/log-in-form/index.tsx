import isEmpty from "lodash-es/isEmpty";
import Button from "@oly_op/react-button";
import { AccessToken } from "@oly_op/musicloud-common/build/types";
import { useState, createElement, FC, FormEventHandler } from "react";

import Input, { InputOnChange } from "../input";

const LogInForm: FC<PropTypes> = ({ onSubmit, emailAddress, onEmailAddressChange }) => {
	const [error, setError] = useState<Error | null>(null);

	const [loading, setLoading] = useState(false);

	const [password, setPassword] = useState("");

	const handlePasswordChange: InputOnChange = value => setPassword(value);

	const handleLogIn = async () => {
		try {
			setLoading(true);

			const body = {
				password,
				emailAddress,
			};

			const response = await fetch("/api/log-in", {
				method: "POST",
				cache: "no-cache",
				body: JSON.stringify(body),
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
			});

			const { accessToken } = (await response.json()) as AccessToken;

			onSubmit(accessToken);
		} catch (e) {
			setError(e as Error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit: FormEventHandler = event => {
		event.preventDefault();
		setError(null);
		void handleLogIn();
	};

	return (
		<form onSubmit={handleSubmit} className="FlexColumnGap">
			<Input
				name="Email"
				tabIndex={1}
				spellCheck="false"
				placeholder="Email"
				autoComplete="email"
				value={emailAddress}
				inputID="emailAddress"
				onChange={onEmailAddressChange}
			/>
			<Input
				autoFocus
				tabIndex={2}
				type="password"
				name="Password"
				value={password}
				inputID="password"
				placeholder="Password"
				autoComplete="password"
				onChange={handlePasswordChange}
			/>
			{error && <p className="ParagraphOne Error">{error.message}</p>}
			<Button
				text="Submit"
				type="submit"
				tabIndex={3}
				rightIcon="login"
				disabled={loading || isEmpty(password)}
			/>
		</form>
	);
};

interface PropTypes {
	emailAddress: string;
	onEmailAddressChange: InputOnChange;
	onSubmit: (accessToken: string) => void;
}

export default LogInForm;
