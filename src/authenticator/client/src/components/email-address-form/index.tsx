import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { FC, FormEventHandler, createElement, useEffect, useState } from "react";

import { isEmailAddress } from "../../helpers";
import Input, { InputOnChange } from "../input";

const bem = createBEM("EmailAddressForm");

const EmailAddressForm: FC<PropTypes> = ({
	emailAddress,
	onEmailAddressChange,
	onEmailAddressExists,
}) => {
	const [error, setError] = useState<Error | null>(null);

	const [loading, setLoading] = useState(false);

	const [isValid, setIsValid] = useState(false);

	const handleChange: InputOnChange = value => {
		if (!loading) {
			setIsValid(isEmailAddress(value));
			onEmailAddressChange(value);
		}
	};

	const handleEmailAddressExists = async () => {
		try {
			setLoading(true);

			const body = {
				emailAddress,
			};

			const response = await fetch("/api/check-email-address-exists", {
				method: "POST",
				cache: "no-cache",
				body: JSON.stringify(body),
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
			});

			const { exists } = (await response.json()) as { exists: boolean };

			onEmailAddressExists(exists);
		} catch (emailAddressExistsError) {
			setError(emailAddressExistsError as Error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit: FormEventHandler = event => {
		event.preventDefault();
		if (isValid) {
			setError(null);
			void handleEmailAddressExists();
		}
	};

	useEffect(() => {
		setIsValid(isEmailAddress(emailAddress));
	}, []);

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
				onChange={handleChange}
				placeholder="example@example.com"
			/>
			{error && <p className="ParagraphOne Error">{error.message}</p>}
			<Button
				type="submit"
				className={bem("submit")}
				rightIcon="arrow_forward"
				disabled={loading || !isValid}
				text={loading ? "Loading..." : "Next"}
			/>
		</form>
	);
};

export type EmailAddressFormOnExists = (exists: boolean) => void;

interface PropTypes {
	emailAddress: string;
	onEmailAddressChange: InputOnChange;
	onEmailAddressExists: EmailAddressFormOnExists;
}

export default EmailAddressForm;
