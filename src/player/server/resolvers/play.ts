import { Play } from "../types"
import { createResolver, getSong, getUser } from "./helpers"

const resolver =
	createResolver<Play>()

export const dateCreated =
	resolver(
		({ parent }) => parent.dateCreated * 1000,
	)

export const user =
	resolver(
		({ parent, context }) => (
			getUser(context.pg)({ userID: parent.userID })
		),
	)

export const song =
	resolver(
		({ parent, context }) => (
			getSong(context.pg)({ songID: parent.songID })
		),
	)