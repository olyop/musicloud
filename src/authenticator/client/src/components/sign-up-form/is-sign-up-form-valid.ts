import isEmpty from "lodash-es/isEmpty";
import isNull from "lodash-es/isNull";

import { isEmailAddress } from "../../helpers";
import { SignUpInput } from "../../types";

const isSignUpFormValid = ({ name, cover, profile, password, emailAddress }: SignUpInput) =>
	!isEmpty(name) &&
	!isEmpty(password) &&
	(isNull(cover) || cover instanceof File) &&
	(isNull(profile) || profile instanceof File) &&
	!isEmpty(emailAddress) &&
	isEmailAddress(emailAddress);

export default isSignUpFormValid;
