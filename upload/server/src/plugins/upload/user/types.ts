import { UserBase } from "@oly_op/musicloud-common"

import { BodyEntry } from "../types"

export type UserName =
	Pick<UserBase, "name">

export interface UserCover {
	cover?: BodyEntry[],
}

export interface UserProfile {
	profile?: BodyEntry[],
}

export interface UserPassword {
	password: string,
}

export interface User
	extends
	UserName,
	UserCover,
	UserProfile,
	UserPassword {}

export interface Route {
	Body: User,
}