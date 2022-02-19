import {
	VFC,
	useState,
	createElement,
	FormEventHandler,
} from "react"

import Button from "@oly_op/react-button"
import { useMutation } from "@apollo/client"
import { UserEmailAddress } from "@oly_op/music-app-common/types"

import SIGN_UP from "./sign-up.gql"
import TextField, { TextFieldOnChange } from "../../components/text-field"

const AuthorizationSignUpForm: VFC<PropTypes> = ({
	emailAddress,
}) => {
	const [ name, setName ] = useState("")
	const [ password, setPassword ] = useState("")

	const [ signUp ] =
		useMutation<Data, UserEmailAddress>(SIGN_UP)

	const handleNameChange: TextFieldOnChange =
		value => setName(value)

	const handleSubmit: FormEventHandler =
		event => {
			event.preventDefault()
			console.log({ signUp, emailAddress })
		}

	return (
		<form onSubmit={handleSubmit} className="FlexColumnGap">
			<TextField
				name="Name"
				value={name}
				tabIndex={-1}
				fieldID="name"
				placeholder="Name"
				autoComplete="given-name"
				onChange={handleNameChange}
			/>
			<TextField
				tabIndex={-2}
				name="Password"
				value={password}
				fieldID="password"
				onChange={setPassword}
				placeholder="Password"
				autoComplete="password"
			/>
			<Button
				icon="login"
				text="Submit"
				type="submit"
			/>
		</form>
	)
}

interface Data {
	signUp: string,
}

interface PropTypes {
	emailAddress: string,
}

export default AuthorizationSignUpForm