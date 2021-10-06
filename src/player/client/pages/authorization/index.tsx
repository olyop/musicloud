import {
	FC,
	useState,
	Fragment,
	createElement,
	FormEventHandler,
} from "react"

import isNull from "lodash/isNull"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import Metadata from "@oly_op/react-metadata"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { UserIDBase, InterfaceWithInput } from "@oly_op/music-app-common/types"

import LOG_IN from "./log-in.gql"
import { useMutation } from "../../hooks"
import { getJWT, setJWT } from "../../helpers"
import TextField from "../../components/text-field"

import "./index.scss"

interface Data {
	logIn: string,
}

interface Form extends UserIDBase {
	password: string,
}

const bem =
	createBEM("Authorization")

const initialState: Form = {
	userID: "",
	password: "",
}

const uploadClientURL =
	`http://${process.env.HOST!}:${process.env.UPLOAD_CLIENT_PORT!}`

const Authorization: FC = ({ children }) => {
	const accessToken = getJWT()

	const [ { userID, password }, setForm ] =
		useState<Form>(initialState)

	const [ isError, setIsError ] =
		useState(false)

	const [ logIn, { loading } ] =
		useMutation<Data, InterfaceWithInput<Form>>(LOG_IN)

	const handleSubmit: FormEventHandler =
		async event => {
			event.preventDefault()
			if (userID && userID) {
				try {
					const { data } = await logIn({
						variables: {
							input: {
								password,
								userID: addDashesToUUID(userID),
							},
						},
					})
					setJWT(data!.logIn)
					location.reload()
				} catch (error) {
					setIsError(true)
				}
			}
		}

	const handleFormChange =
		(fieldKey: keyof Form) =>
			(value: string) =>
				setForm(prevState => ({
					...prevState,
					[fieldKey]: value,
				}))

	if (loading) {
		return null
	} else if (isNull(accessToken)) {
		return (
			<Metadata title="Log In">
				<div className={bem("", "FullWidthHeight")}>
					<div className={bem("main")}>
						<div
							className={bem(
								isError && "error",
								"main-content",
								"Elevated Padding",
							)}
						>
							<h1 className="HeadingFour MarginBottomQuart">
								Musicloud
							</h1>
							<h1 className="HeadingSix MarginBottomOneHalf">
								Log In
							</h1>
							<form onSubmit={handleSubmit} className="FlexColumnGap">
								<TextField
									name="User ID"
									value={userID}
									maxLength={32}
									fieldID="username"
									autoComplete="username"
									placeholder="Identification"
									onChange={handleFormChange("userID")}
								/>
								<TextField
									name="Password"
									type="password"
									value={password}
									fieldID="password"
									placeholder="Password"
									autoComplete="current-password"
									onChange={handleFormChange("password")}
								/>
								<Button
									icon="login"
									type="submit"
									text="Log In"
								/>
							</form>
						</div>
					</div>
					<a
						href={uploadClientURL}
						className={bem("footer", "Elevated")}
						children={(
							<Button
								transparent
								icon="arrow_back"
								text="Musicloud Upload"
								className={bem("footer-button")}
							/>
						)}
					/>
				</div>
			</Metadata>
		)
	} else {
		return (
			<Fragment>
				{children}
			</Fragment>
		)
	}
}

export default Authorization