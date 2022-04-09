import {
	VFC,
	useState,
	useEffect,
	createElement,
	FormEventHandler,
} from "react"

import Button from "@oly_op/react-button"
import isString from "lodash-es/isString"
import { UserEmailAddressBase } from "@oly_op/musicloud-common"

import { useMutation } from "../../hooks"
import isEmailAddress from "./is-email-address"
import EMAIL_ADDRESS_EXISTS from "./email-address-exists.gql"
import Input, { InputOnChange } from "../../components/input"

const AuthorizationEmailAddressForm: VFC<PropTypes> = ({
	emailAddress,
	onEmailAddressChange,
	onEmailAddressExists,
}) => {
	const [ isValid, setIsValid ] =
		useState(false)

	const [ emailAddressExists, { data } ] =
		useMutation<Data, UserEmailAddressBase>(EMAIL_ADDRESS_EXISTS)

	const handleChange: InputOnChange =
		value => {
			if (isString(value)) {
				setIsValid(isEmailAddress(value))
				onEmailAddressChange(value)
			}
		}

	const handleSubmit: FormEventHandler =
		event => {
			event.preventDefault()
			if (isValid) {
				void emailAddressExists({ variables: { emailAddress } })
			}
		}

	useEffect(() => {
		setIsValid(isEmailAddress(emailAddress))
	}, [])

	useEffect(() => {
		if (data) {
			onEmailAddressExists(data.emailAddressExists)
		}
	}, [data])

	return (
		<form onSubmit={handleSubmit} className="FlexColumnGap">
			<Input
				autoFocus
				name="Email"
				tabIndex={0}
				autoComplete="email"
				value={emailAddress}
				inputID="emailAddress"
				onChange={handleChange}
				placeholder="example@example.com"
			/>
			<Button
				text="Next"
				type="submit"
				disabled={!isValid}
				rightIcon="arrow_forward"
			/>
		</form>
	)
}

interface Data {
	emailAddressExists: boolean,
}

export type EmailAddressFormOnExists =
	(exists: boolean) => void

interface PropTypes {
	emailAddress: string,
	onEmailAddressChange: InputOnChange,
	onEmailAddressExists: EmailAddressFormOnExists,
}

export default AuthorizationEmailAddressForm