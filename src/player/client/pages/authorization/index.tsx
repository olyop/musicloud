import { isNull } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import { FC, Fragment, createElement, useState } from "react"

import SignUpForm from "./sign-up-form"
import determineTitle from "./determine-title"
import { useStateAccessToken } from "../../redux"
import { TextFieldOnChange } from "../../components/text-field"
import EmailAddressForm, { EmailAddressFormOnExists } from "./email-address-form"

import "./index.scss"

const bem =
	createBEM("Authorization")

const Authorization: FC = ({ children }) => {
	const accessToken = useStateAccessToken()

	const [ emailAddress, setEmailAddress ] =
		useState("oliver.plummer@outlook.com")

	const [ emailAddressChecked, setEmailAddressChecked ] =
		useState(false)

	const [ emailAddressExists, setEmailAddressExists ] =
		useState(false)

	const handleEmailAddressChange: TextFieldOnChange =
		value => {
			setEmailAddress(value)
		}

	const handleEmailAddressExists: EmailAddressFormOnExists =
		exists => {
			setEmailAddressExists(exists)
			setEmailAddressChecked(true)
		}

	if (isNull(accessToken)) {
		return (
			<div className={bem("", "FullWidthAndHeight")}>
				<div className={bem("main", "FlexColumnGap Elevated Padding")}>
					<h1 className="HeadingFour">
						{determineTitle(emailAddressChecked, emailAddressExists)}
					</h1>
					{emailAddressChecked ? (
						emailAddressExists ? (
							<p className="BodyOne">
								{`${emailAddress} - ${String(emailAddressExists)}`}
							</p>
						) : (
							<SignUpForm
								emailAddress={emailAddress}
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