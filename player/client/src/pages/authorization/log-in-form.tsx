import isEmpty from "lodash-es/isEmpty"
import Button from "@oly_op/react-button"
import { InterfaceWithInput, UserEmailAddress } from "@oly_op/musicloud-common"
import { useState, createElement, VFC, FormEventHandler, useEffect } from "react"

import Input, { InputOnChange } from "../../components/input"

import LOG_IN from "./log-in.gql"
import { useMutation } from "../../hooks"

const AuthorizationLogInForm: VFC<PropTypes> = ({
	onSubmit,
	emailAddress,
	onEmailAddressChange,
}) => {
	const [ password, setPassword ] = useState("")

	const [ logIn, { data, loading } ] =
		useMutation<Data, Args>(LOG_IN)

	const handlePasswordChange: InputOnChange =
		value => setPassword(value)

	const input: LogInInput = {
		password,
		emailAddress,
	}

	const handleLogIn: FormEventHandler =
		event => {
			event.preventDefault()
			void logIn({ variables: { input } })
		}

	useEffect(() => {
		if (data) {
			onSubmit(data.logIn)
		}
	})

	return (
		<form onSubmit={handleLogIn} className="FlexColumnGap">
			<Input
				name="Email"
				tabIndex={1}
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
			<Button
				text="Submit"
				type="submit"
				tabIndex={3}
				rightIcon="login"
				disabled={loading || isEmpty(password)}
			/>
		</form>
	)
}

interface Data {
	logIn: string,
}

interface LogInInput extends UserEmailAddress {
	password: string,
}

type Args =
	InterfaceWithInput<LogInInput>

interface PropTypes {
	emailAddress: string,
	onEmailAddressChange: InputOnChange,
	onSubmit: (accessToken: string) => void,
}

export default AuthorizationLogInForm