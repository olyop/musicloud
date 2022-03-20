import isNull from "lodash-es/isNull"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { FC, Fragment, createElement, useState } from "react"

import LogInForm from "./log-in-form"
import SignUpForm from "./sign-up-form"
import determineTitle from "./determine-title"
import { InputOnChange } from "../../components/input"
import EmailAddressForm, { EmailAddressFormOnExists } from "./email-address-form"
import { updateAccessToken, useDispatch, useStateAccessToken } from "../../redux"

import "./index.scss"

const bem =
	createBEM("Authorization")

const Authorization: FC = ({ children }) => {
	const dispatch = useDispatch()
	const accessToken = useStateAccessToken()

	const [ emailAddress, setEmailAddress ] =
		useState("")

	const [ emailAddressExists, setEmailAddressExists ] =
		useState(false)

	const [ emailAddressChecked, setEmailAddressChecked ] =
		useState(false)

	const handleBack =
		() => setEmailAddressChecked(false)

	const handleEmailAddressChange: InputOnChange =
		value => setEmailAddress(value)

	const handleEmailAddressExists: EmailAddressFormOnExists =
		exists => {
			setEmailAddressChecked(true)
			setEmailAddressExists(exists)
		}

	const handleSubmit =
		(value: string) => {
			dispatch(updateAccessToken(value))
		}

	if (isNull(accessToken)) {
		return (
			<div className={bem("", "FullWidthAndHeight")}>
				<div className={bem("main", "FlexColumnGap Elevated Padding")}>
					<div className={bem("main-header", "FlexRowGapQuart")}>
						{emailAddressChecked && (
							<Button
								transparent
								tabIndex={5}
								icon="arrow_back"
								onClick={handleBack}
								className={bem("main-header-back")}
							/>
						)}
						<h1 className="HeadingFour">
							{determineTitle(emailAddressChecked, emailAddressExists)}
						</h1>
					</div>
					{emailAddressChecked ? (
						emailAddressExists ? (
							<LogInForm
								onSubmit={handleSubmit}
								emailAddress={emailAddress}
								onEmailAddressChange={handleEmailAddressChange}
							/>
						) : (
							<SignUpForm
								onSubmit={handleSubmit}
								emailAddress={emailAddress}
								onEmailAddressChange={handleEmailAddressChange}
							/>
						)
					) : (
						<EmailAddressForm
							emailAddress={emailAddress}
							onEmailAddressChange={handleEmailAddressChange}
							onEmailAddressExists={handleEmailAddressExists}
						/>
					)}
				</div>
			</div>
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