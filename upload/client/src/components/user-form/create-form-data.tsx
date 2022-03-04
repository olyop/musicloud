import { User } from "./types"

const createFormData =
	(user: User) => {
		const body = new FormData()

		body.append("name", user.name)
		body.append("password", user.password)

		if (user.cover) {
			body.append("cover", user.cover)
		}

		if (user.profile) {
			body.append("profile", user.profile)
		}

		return body
	}

export default createFormData