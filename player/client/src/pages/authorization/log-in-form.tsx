import noop from "lodash-es/noop"
import isEmpty from "lodash-es/isEmpty"
import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { useState, createElement, FC, FormEventHandler, useEffect } from "react"

import LOG_IN from "./log-in.gql"
import { useMutation } from "../../hooks"
import { LogInArgs, LogInData } from "./types"
import Input, { InputOnChange } from "../../components/input"

const AuthorizationLogInForm: FC<PropTypes> = ({
	onSubmit,
	emailAddress,
	onEmailAddressChange,
}) => {
	const [ password, setPassword ] = useState("")

	const [ logIn, { data, loading, error } ] =
		useMutation<LogInData, LogInArgs>(LOG_IN)

	const handlePasswordChange: InputOnChange =
		value => setPassword(value)

	const handleLogIn: FormEventHandler =
		event => {
			event.preventDefault()

			const variables: LogInArgs = {
				input: {
					password,
					emailAddress,
				},
			}

			void logIn({ variables }).catch(noop)
		}

	useEffect(() => {
		if (data) {
			onSubmit(data.logIn)
		}
	})

	return (
		<Head pageTitle="Log In">
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
				{error && (
					<p className="BodyOne Error">
						{error.message}
					</p>
				)}
				<Button
					text="Submit"
					type="submit"
					tabIndex={3}
					rightIcon="login"
					disabled={loading || isEmpty(password)}
				/>
			</form>
		</Head>
	)
}

interface PropTypes {
	emailAddress: string,
	onEmailAddressChange: InputOnChange,
	onSubmit: (accessToken: string) => void,
}

export default AuthorizationLogInForm