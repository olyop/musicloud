import {
	FC,
	useState,
	createElement,
	FormEventHandler,
	useEffect,
} from "react"

import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"

import SIGN_UP from "./sign-up.gql"
import { useMutation } from "../../hooks"
import { SignUpArgs, SignUpData, SignUpInput } from "./types"
import isSignUpFormValid from "./is-sign-up-form-valid"
import Input, { InputOnChange } from "../../components/input"

const AuthorizationSignUpForm: FC<PropTypes> = ({
	onSubmit,
	emailAddress,
	onEmailAddressChange,
}) => {
	const [ name, setName ] = useState("")
	const [ password, setPassword ] = useState("")
	const [ cover, setCover ] = useState<File | null>(null)
	const [ profile, setProfile ] = useState<File | null>(null)

	const [ signUp, { data, loading } ] =
		useMutation<SignUpData, SignUpArgs>(SIGN_UP)

	const handleNameChange: InputOnChange =
		value => setName(value)

	const handlePasswordChange: InputOnChange =
		value => setPassword(value)

	const handleCoverChange: InputOnChange<File> =
		value => setCover(value)

	const handleProfileChange: InputOnChange<File> =
		value => setProfile(value)

	const input: SignUpInput = {
		name,
		cover,
		profile,
		password,
		emailAddress,
	}

	const handleSignUp: FormEventHandler =
		event => {
			event.preventDefault()
			if (isSignUpFormValid(input)) {
				void signUp({ variables: { input } })
			}
		}

	useEffect(() => {
		if (data) {
			onSubmit(data.signUp)
		}
	}, [data])

	return (
		<Head pageTitle="Sign Up">
			<form onSubmit={handleSignUp} className="FlexColumnGap">
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
					name="Name"
					value={name}
					tabIndex={2}
					inputID="name"
					placeholder="Name"
					autoComplete="given-name"
					onChange={handleNameChange}
				/>
				<Input
					tabIndex={3}
					type="password"
					name="Password"
					value={password}
					inputID="password"
					placeholder="Password"
					autoComplete="password"
					onChange={handlePasswordChange}
				/>
				<Input
					type="file"
					tabIndex={4}
					name="Profile"
					value={profile}
					inputID="profile"
					imageOrientation="portrait"
					onChange={handleProfileChange}
				/>
				<Input
					type="file"
					name="Cover"
					tabIndex={5}
					value={cover}
					inputID="cover"
					imageOrientation="landscape"
					onChange={handleCoverChange}
				/>
				<Button
					text="Submit"
					type="submit"
					tabIndex={6}
					rightIcon="login"
					disabled={loading || !isSignUpFormValid(input)}
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

export default AuthorizationSignUpForm