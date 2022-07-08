import isNull from "lodash-es/isNull"
import isEmpty from "lodash-es/isEmpty"

import { SignUpInput } from "../../types"
import { isEmailAddress } from "../../helpers"

const isSignUpFormValid =
	({ name, cover, profile, password, emailAddress }: SignUpInput) => (
		!isEmpty(name) &&
		!isEmpty(password) &&
		(isNull(cover) || cover instanceof File) &&
		(isNull(profile) || profile instanceof File) &&
		(!isEmpty(emailAddress) && isEmailAddress(emailAddress))
	)

export default isSignUpFormValid