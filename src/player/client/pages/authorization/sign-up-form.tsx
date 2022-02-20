import {
	VFC,
	useState,
	createElement,
	FormEventHandler,
} from "react"

import Button from "@oly_op/react-button"
import { useMutation } from "@apollo/client"
import { UserBase } from "@oly_op/music-app-common/types"

import SIGN_UP from "./sign-up.gql"
import Input, { InputOnChange } from "../../components/input"

const AuthorizationSignUpForm: VFC<PropTypes> = ({
	emailAddress,
	onEmailAddressChange,
}) => {
	const [ name, setName ] = useState("Oliver")
	const [ password, setPassword ] = useState("password")
	const [ cover, setCover ] = useState<File | null>(null)
	const [ profile, setProfile ] = useState<File | null>(null)

	const [ signUp ] =
		useMutation<Data, Args>(SIGN_UP)

	const handleNameChange: InputOnChange =
		value => setName(value)

	const handlePasswordChange: InputOnChange =
		value => setPassword(value)

	const handleCoverChange: InputOnChange<File> =
		value => setCover(value)

	const handleProfileChange: InputOnChange<File> =
		value => setProfile(value)

	const handleSubmit: FormEventHandler =
		async event => {
			event.preventDefault()
			if (cover && profile) {
				await signUp({
					variables: {
						input: {
							name,
							cover,
							profile,
							password,
							emailAddress,
						},
					},
				})
			}
		}

	return (
		<form onSubmit={handleSubmit} className="FlexColumnGap">
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
				disabled={!cover && !profile}
			/>
		</form>
	)
}

interface Data {
	signUp: string,
}

export interface SignUpInput extends Omit<UserBase, "userID" | "dateJoined"> {
	cover: File,
	profile: File,
	password: string,
}

export interface Args {
	input: SignUpInput,
}

interface PropTypes {
	emailAddress: string,
	onEmailAddressChange: InputOnChange,
}

export default AuthorizationSignUpForm