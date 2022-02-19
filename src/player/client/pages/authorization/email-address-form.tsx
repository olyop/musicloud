import {
	VFC,
	useState,
	createElement,
	FormEventHandler,
	useEffect,
} from "react"

import Button from "@oly_op/react-button"
import { useMutation } from "@apollo/client"
import { UserEmailAddress } from "@oly_op/music-app-common/types"

import isEmailAddress from "./is-email-address"
import EMAIL_ADDRESS_EXISTS from "./email-address-exists.gql"
import TextField, { TextFieldOnChange } from "../../components/text-field"

const AuthorizationEmailAddressForm: VFC<PropTypes> = ({
	emailAddress,
	onEmailAddressChange,
	onEmailAddressExists,
}) => {
	const [ isValid, setIsValid ] =
		useState(false)

	const [ emailAddressExists ] =
		useMutation<Data, UserEmailAddress>(EMAIL_ADDRESS_EXISTS)

	const handleChange: TextFieldOnChange =
		value => {
			setIsValid(isEmailAddress(value))
			onEmailAddressChange(value)
		}

	const handleSubmit: FormEventHandler =
		async event => {
			event.preventDefault()

			if (isValid) {
				const { data } =
					await emailAddressExists({ variables: { emailAddress } })
				if (data) {
					onEmailAddressExists(data.emailAddressExists)
				}
			}
		}

	useEffect(() => {
		setIsValid(isEmailAddress(emailAddress))
	}, [])

	return (
		<form onSubmit={handleSubmit} className="FlexColumnGap">
			<TextField
				name="Email"
				tabIndex={0}
				autoComplete="email"
				value={emailAddress}
				fieldID="emailAddress"
				onChange={handleChange}
				isValid={isValid || undefined}
				placeholder="example@example.com"
			/>
			<Button
				text="Next"
				type="submit"
				icon="arrow_forward"
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
	onEmailAddressChange: TextFieldOnChange,
	onEmailAddressExists: EmailAddressFormOnExists,
}

export default AuthorizationEmailAddressForm