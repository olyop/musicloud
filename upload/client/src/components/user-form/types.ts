import { UserBase } from "@oly_op/musicloud-common"

export interface UserImages {
	cover?: File,
	profile?: File,
}

export interface UserPassword {
	password: string,
}

export interface User
	extends Pick<UserBase, "name">, UserPassword, UserImages {}