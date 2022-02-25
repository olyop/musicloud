import { Play } from "../types"
import createParentResolver from "./create-parent-resolver"
import { getSong, getUser, timeStampToMilliseconds } from "./helpers"

const resolver =
	createParentResolver<Play>()

export const dateCreated =
	resolver(
		({ parent }) => (
			Promise.resolve(
				timeStampToMilliseconds(parent.dateCreated),
			)
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