import {
	FC,
	useState,
	useEffect,
	createElement,
	FormEventHandler,
} from "react"

import Button from "@oly_op/react-button"

import { isEmailAddress } from "../../helpers"
import Input, { InputOnChange } from "../input"

const EmailAddressForm: FC<PropTypes> = ({
	emailAddress,
	onEmailAddressChange,
	onEmailAddressExists,
}) => {
	const [ error, setError ] =
		useState<Error | null>(null)

	const [ loading, setLoading ] =
		useState(false)

	const [ isValid, setIsValid ] =
		useState(false)

	const handleChange: InputOnChange =
		value => {
			setIsValid(isEmailAddress(value))
			onEmailAddressChange(value)
		}

	const handleEmailAddressExists =
		async () => {
			try {
				setLoading(true)

				const body = {
					emailAddress,
				}

				const response =
					await fetch("/api/check-email-address-exists", {
						method: "POST",
						cache: "no-cache",
						body: JSON.stringify(body),
						headers: {
							"Accept": "application/json",
							"Content-Type": "application/json",
						},
					})

				const { exists } =
					await response.json() as { exists: boolean }

				onEmailAddressExists(exists)
			} catch (e) {
				setError(e as Error)
			} finally {
				setLoading(false)
			}
		}

	const handleSubmit: FormEventHandler =
		event => {
			event.preventDefault()
			if (isValid) {
				setError(null)
				void handleEmailAddressExists()
			}
		}

	useEffect(() => {
		setIsValid(isEmailAddress(emailAddress))
	}, [])

	return (
		<form onSubmit={handleSubmit} className="FlexColumnGap">
			<Input
				autoFocus
				name="Email"
				tabIndex={0}
				spellCheck="false"
				autoComplete="email"
				value={emailAddress}
				inputID="emailAddress"
				onChange={handleChange}
				placeholder="example@example.com"
			/>
			{error && (
				<p className="ParagraphOne Error">
					{error.message}
				</p>
			)}
			<Button
				text="Next"
				type="submit"
				rightIcon="arrow_forward"
				disabled={loading || !isValid}
			/>
		</form>
	)
}

export type EmailAddressFormOnExists =
	(exists: boolean) => void

interface PropTypes {
	emailAddress: string,
	onEmailAddressChange: InputOnChange,
	onEmailAddressExists: EmailAddressFormOnExists,
}

export default EmailAddressForm