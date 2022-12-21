import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import isNull from "lodash-es/isNull";
import { FC, Fragment, createElement, useRef, useState } from "react";

import "./application.scss";
import CreatedBy from "./components/created-by";
import DeleteAccountForm from "./components/delete-account";
import EmailAddressForm, { EmailAddressFormOnExists } from "./components/email-address-form";
import ForgotPasswordForm from "./components/forgot-password-form";
import { InputOnChange } from "./components/input";
import LogInForm from "./components/log-in-form";
import LoggedIn from "./components/logged-in";
import SignUpForm from "./components/sign-up-form";
import { determineTitle, isValidServiceName } from "./helpers";

const bem = createBEM("Application");

const Application: FC = () => {
	const [accessToken, setAccessToken] = useState<string | null>(null);

	const [emailAddress, setEmailAddress] = useState("");
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [emailAddressExists, setEmailAddressExists] = useState(false);
	const [emailAddressChecked, setEmailAddressChecked] = useState(false);

	const searchParams = useRef(new URLSearchParams(location.search));
	const redirectPath = useRef(searchParams.current.get("redirectPath"));
	const deleteAccount = useRef(searchParams.current.has("deleteAccount"));
	const redirectService = useRef(searchParams.current.get("redirect") || "player");

	const handleBack = () => {
		setEmailAddressChecked(false);
		setShowForgotPassword(false);
	};

	const handleEmailAddressChange: InputOnChange = value => setEmailAddress(value);

	const handleEmailAddressExists: EmailAddressFormOnExists = exists => {
		setEmailAddressChecked(true);
		setEmailAddressExists(exists);
	};

	const handleOpenForgotPassword = () => setShowForgotPassword(true);

	const resetForm = () => {
		setEmailAddressExists(false);
		setShowForgotPassword(false);
		setEmailAddressChecked(false);
		setEmailAddress("");
		deleteAccount.current = false;
	};

	const handleSubmit = (value: string) => {
		setAccessToken(value);
		resetForm();
	};

	return (
		<div className={bem("", "PaddingTopBottom FullWidthAndHeight FullWidthAndHeight")}>
			<div className={bem("content", "FlexColumnGap Elevated Padding")}>
				{deleteAccount.current ? (
					<DeleteAccountForm
						onClose={resetForm}
						emailAddress={emailAddress}
						onEmailAddressChange={handleEmailAddressChange}
					/>
				) : (
					<Fragment>
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
										{determineTitle(emailAddressChecked, emailAddressExists, showForgotPassword)}
									</h1>
								</div>
								{emailAddressChecked || <CreatedBy />}
							</div>
						)}
						{isValidServiceName(redirectService.current) ? (
							<Fragment>
								{showForgotPassword ? (
									<ForgotPasswordForm
										onSubmit={handleSubmit}
										emailAddress={emailAddress}
										onEmailAddressChange={handleEmailAddressChange}
									/>
								) : (
									<Fragment>
										{accessToken ? (
											<LoggedIn
												accessToken={accessToken}
												redirectService={redirectService.current}
												redirectPath={
													isNull(redirectPath.current) ? undefined : redirectPath.current
												}
											/>
										) : (
											<Fragment>
												{emailAddressChecked ? (
													emailAddressExists ? (
														<LogInForm
															onSubmit={handleSubmit}
															emailAddress={emailAddress}
															onEmailAddressChange={handleEmailAddressChange}
															onOpenForgotPassword={handleOpenForgotPassword}
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
									</Fragment>
								)}
							</Fragment>
						) : (
							<p className="ParagraphOne Error">Invalid redirect url paramater</p>
						)}
					</Fragment>
				)}
			</div>
		</div>
	);
};

export default Application;
