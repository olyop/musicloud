import {
	FC,
	useState,
	createElement,
	FormEventHandler,
} from "react"

import Button from "@oly_op/react-button"

import Input, { InputOnChange } from "../input"
import isSignUpFormValid from "./is-sign-up-form-valid"

const SignUpForm: FC<PropTypes> = ({
	onSubmit,
	emailAddress,
	onEmailAddressChange,
}) => {
	const [ error, setError ] =
		useState<Error | null>(null)

	const [ loading, setLoading ] =
		useState(false)

	const [ name, setName ] = useState("Oliver")
	const [ password, setPassword ] = useState("password")
	const [ cover, setCover ] = useState<File | null>(null)
	const [ profile, setProfile ] = useState<File | null>(null)

	const handleNameChange: InputOnChange =
		value => setName(value)

	const handlePasswordChange: InputOnChange =
		value => setPassword(value)

	const handleCoverChange: InputOnChange<File> =
		value => setCover(value)

	const handleProfileChange: InputOnChange<File> =
		value => setProfile(value)

	const handleSignUp =
		async () => {
			setLoading(true)

			const body = new FormData()
			body.append("name", name)
			body.append("cover", cover!)
			body.append("profile", profile!)
			body.append("password", password)
			body.append("emailAddress", emailAddress)

			const response =
				await fetch("/api/sign-up", {
					method: "POST",
					cache: "no-cache",
					body,
				})

			const data =
				await response.json() as DataOk | DataError

			if (response.ok && "accessToken" in data) {
				onSubmit(data.accessToken)
			} else if ("message" in data) {
				setError(new Error(data.message))
			} else {
				setError(new Error("Unknown error"))
			}

			setLoading(false)
		}

	const handleSubmit: FormEventHandler =
		event => {
			event.preventDefault()

			if (isSignUpFormValid({
				name,
				cover,
				profile,
				password,
				emailAddress,
			})) {
				setError(null)
				void handleSignUp()
			}
		}

	return (
		<form onSubmit={handleSubmit} className="FlexColumnGap">
			<Input
				name="Email"
				tabIndex={1}
				spellCheck="false"
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
				spellCheck="false"
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
			{error && (
				<p className="ParagraphOne Error">
					{error.message}
				</p>
			)}
			<Button
				text="Submit"
				type="submit"
				tabIndex={6}
				rightIcon="login"
				disabled={loading || !isSignUpFormValid({
					name,
					cover,
					profile,
					password,
					emailAddress,
				})}
			/>
		</form>
	)
}

interface DataOk {
	accessToken: string,
}

interface DataError {
	message: string,
}

interface PropTypes {
	emailAddress: string,
	onEmailAddressChange: InputOnChange,
	onSubmit: (accessToken: string) => void,
}

export default SignUpForm