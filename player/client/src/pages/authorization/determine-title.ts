import { TITLE } from "@oly_op/musicloud-common"

const determineTitle =
	(checked: boolean, exists: boolean) => (
		checked ? (
			(exists ?
				"Log In" :
				"Sign Up")
		) : (
			TITLE
		)
	)

export default determineTitle