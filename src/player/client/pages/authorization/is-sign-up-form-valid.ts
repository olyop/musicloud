import isNull from "lodash-es/isNull"
import isEmpty from "lodash-es/isEmpty"

import { SignUpInput } from "./sign-up-form"
import isEmailAddress from "./is-email-address"

const isSignUpFormValid =
	({ name, cover, profile, password, emailAddress }: SignUpInput) => (
		!isEmpty(name) &&
		!isEmpty(password) &&
		(isNull(cover) || cover instanceof File) &&
		(isNull(profile) || profile instanceof File) &&
		(!isEmpty(emailAddress) && isEmailAddress(emailAddress))
	)

export default isSignUpFormValid