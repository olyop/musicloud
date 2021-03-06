import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { FC, createElement, useState, Fragment } from "react"

import { determineTitle } from "./helpers"
import LoggedIn from "./components/logged-in"
import LogInForm from "./components/log-in-form"
import SignUpForm from "./components/sign-up-form"
import { InputOnChange } from "./components/input"
import EmailAddressForm, { EmailAddressFormOnExists } from "./components/email-address-form"

import packageDotJSON from "../../../../package.json"

import "./application.scss"

const bem =
	createBEM("Application")

const Application: FC = () => {
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [ accessToken, setAccessToken ] =
		useState<string | null>(null)

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
			setAccessToken(value)
			setEmailAddressExists(false)
			setEmailAddressChecked(false)
			setEmailAddress("")
		}

	return (
		<div className={bem("", "PaddingTopBottom FullWidthAndHeight")}>
			<div className={bem("content", "FlexColumnGap Elevated Padding")}>
				{accessToken ? null : (
					<div className="FlexColumnGapHalf">
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
						{emailAddressChecked || (
							<p className="BodyTwo">
								<Fragment>Created by </Fragment>
								<a
									target="_blank"
									rel="noreferrer"
									href="https://olyop.com"
									children={packageDotJSON.author.name}
								/>
							</p>
						)}
					</div>
				)}
				{accessToken ? (
					<LoggedIn
						accessToken={accessToken}
					/>
				) : (
					<Fragment>
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
					</Fragment>
				)}
			</div>
		</div>
	)
}

export default Application