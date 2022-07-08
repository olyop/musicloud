import isNull from "lodash-es/isNull"
import { TITLE } from "@oly_op/musicloud-common"

export const determineTitle =
	(checked: boolean, exists: boolean) => (
		checked ? (
			exists ?
				"Log In" :
				"Sign Up"
		) : (
			TITLE
		)
	)

export const isEmailAddress =
	(value: string) =>
		// eslint-disable-next-line max-len
		!isNull(value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/))