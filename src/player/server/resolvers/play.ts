import { Play } from "../types"
import { getSong, getUser } from "./helpers"
import createParentResolver from "./create-parent-resolver"

const resolver =
	createParentResolver<Play>()

export const dateCreated =
	resolver(
		({ parent }) => (
			parent.dateCreated * 1000
		),
	)

export const user =
	resolver(
		({ parent, context }) => (
			getUser(context.pg)({
				userID: parent.userID,
			})
		),
	)

export const song =
	resolver(
		({ parent, context }) => (
			getSong(context.pg)({
				songID: parent.songID,
			})
		),
	)