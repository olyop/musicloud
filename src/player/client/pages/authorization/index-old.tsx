import {
	FC,
	useState,
	Fragment,
	createElement,
	FormEventHandler,
	useRef,
} from "react"

import { isNull } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { useSearchParams } from "react-router-dom"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { UserID, InterfaceWithInput } from "@oly_op/music-app-common/types"

import LOG_IN from "./log-in.gql"
import { useMutation } from "../../hooks"
import TextField from "../../components/text-field"
import { updateAccessToken, useDispatch, useStateAccessToken } from "../../redux"

import "./index.scss"

interface Data {
	logIn: string,
}

interface Form extends UserID {
	password: string,
}

const bem =
	createBEM("Authorization")

const createInitialState =
	({ userID, password }: Partial<Form>): Form => ({
		userID: userID || "",
		password: password || "",
	})

const uploadClientURL =
	`http://localhost:${process.env.UPLOAD_CLIENT_PORT}`

const Authorization: FC = ({ children }) => {
	const dispatch = useDispatch()
	const accessToken = useStateAccessToken()
	const [ searchParams, setSearchParams ] = useSearchParams()

	const initialState =
		useRef(createInitialState({
			userID: searchParams.get("userID") || undefined,
			password: searchParams.get("password") || undefined,
		}))

	const [ { userID, password }, setForm ] =
		useState<Form>(initialState.current)

	const [ logIn, { error } ] =
		useMutation<Data, InterfaceWithInput<Form>>(LOG_IN)

	const handleSubmit: FormEventHandler =
		async event => {
			event.preventDefault()
			const { data } =
				await logIn({
					variables: {
						input: {
							password,
							userID: addDashesToUUID(userID),
						},
					},
				})
			if (data) {
				dispatch(updateAccessToken(data.logIn))
				setForm(initialState.current)
				setSearchParams("")
			}
		}

	const handleFormChange =
		(fieldKey: keyof Form) =>
			(value: string) =>
				setForm(prevState => ({
					...prevState,
					[fieldKey]: value,
				}))

	if (isNull(accessToken)) {
		return (
			<Metadata title="Log In">
				<div className={bem("", "FullWidthAndHeight")}>
					<div className={bem("main", "FlexRowCenter")}>
						<div className={bem("main-content", "Elevated Padding")}>
							<h1 className="HeadingFour MarginBottom">
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
								{error && (
									<p className={bem("main-error", "BodyTwo")}>
										<Fragment>Error: </Fragment>
										{error.message}
									</p>
								)}
								<Button
									icon="login"
									type="submit"
									text="Submit"
								/>
							</form>
						</div>
					</div>
					<a href={uploadClientURL} className={bem("footer", "Elevated")}>
						<Button
							transparent
							icon="arrow_back"
							text="Musicloud Upload"
							className={bem("footer-button")}
						/>
					</a>
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