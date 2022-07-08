import { UserEmailAddressBase } from "@oly_op/musicloud-common"

import resolver from "./resolver"
import { emailAddressExists as emailAddressExistsHelper } from "../helpers"

export const emailAddressExists =
	resolver<boolean, UserEmailAddressBase>(
		({ args, context }) => (
			emailAddressExistsHelper(context.pg)(args)
		),
		{ global: false },
	)