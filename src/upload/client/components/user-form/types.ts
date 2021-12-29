import { UserBase } from "@oly_op/music-app-common/types"

export interface UserImages {
	cover?: File,
	profile?: File,
}

export interface UserPassword {
	password: string,
}

export interface User
	extends Pick<UserBase, "name">, UserPassword, UserImages {}