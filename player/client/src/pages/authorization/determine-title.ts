import { TITLE } from "@oly_op/music-app-common/metadata"

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