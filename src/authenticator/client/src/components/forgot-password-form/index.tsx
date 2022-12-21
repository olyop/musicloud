import { AccessToken } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import isEmpty from "lodash-es/isEmpty";
import { FC, FormEventHandler, createElement, useState } from "react";

import Input, { InputOnChange } from "../input";

const ForgotPasswordForm: FC<PropTypes> = ({ onSubmit, emailAddress, onEmailAddressChange }) => {
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const handleCurrentPasswordChange: InputOnChange = value => {
		setCurrentPassword(value);
	};

	const handleNewPasswordChange: InputOnChange = value => {
		setNewPassword(value);
	};

	const handleUpdatePassword = async () => {
		try {
			setLoading(true);

			const body = {
				emailAddress,
				currentPassword,
				newPassword,
			};
			const response = await fetch("/api/change-password", {
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
		} catch (forgotPasswordError) {
			setError(forgotPasswordError as Error);
		} finally {
			setLoading(false);
		}
	};

	const isValid = !isEmpty(currentPassword) && !isEmpty(newPassword) && !isEmpty(emailAddress);

	const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
		event.preventDefault();
		if (isValid) {
			setError(null);
			void handleUpdatePassword();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="FlexColumnGap">
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
				value={currentPassword}
				inputID="current-password"
				placeholder="Current Password"
				autoComplete="current-password"
				onChange={handleCurrentPasswordChange}
			/>
			<Input
				autoFocus
				tabIndex={2}
				type="password"
				name="Password"
				value={newPassword}
				inputID="new-password"
				placeholder="New Password"
				autoComplete="new-password"
				onChange={handleNewPasswordChange}
			/>
			{error && <p className="ParagraphOne Error">{error.message}</p>}
			<Button
				type="submit"
				rightIcon="edit"
				disabled={loading || !isValid}
				text={loading ? "Loading..." : "Submit"}
			/>
		</form>
	);
};

interface PropTypes {
	onSubmit: (accessToken: string) => void;
	emailAddress: string;
	onEmailAddressChange: InputOnChange;
}

export default ForgotPasswordForm;
