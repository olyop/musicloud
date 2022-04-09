import isEmpty from "lodash-es/isEmpty"
import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { useState, createElement, VFC, FormEventHandler, useEffect } from "react"

import LOG_IN from "./log-in.gql"
import { useMutation } from "../../hooks"
import { LogInArgs, LogInData, LogInInput } from "./types"
import Input, { InputOnChange } from "../../components/input"

const AuthorizationLogInForm: VFC<PropTypes> = ({
	onSubmit,
	emailAddress,
	onEmailAddressChange,
}) => {
	const [ password, setPassword ] = useState("")

	const [ logIn, { data, loading } ] =
		useMutation<LogInData, LogInArgs>(LOG_IN)

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
		<Metadata title="Log In">
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
		</Metadata>
	)
}

interface PropTypes {
	emailAddress: string,
	onEmailAddressChange: InputOnChange,
	onSubmit: (accessToken: string) => void,
}

export default AuthorizationLogInForm