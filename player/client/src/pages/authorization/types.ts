import {
	UserBase,
	UserPasswordBase,
	InterfaceWithInput,
	UserEmailAddressBase,
} from "@oly_op/musicloud-common"

export interface LogInInput
	extends UserPasswordBase, UserEmailAddressBase {}

type FileInput =
	File | null

export interface SignUpInput
	extends Omit<UserBase, "userID" | "dateJoined">, UserPasswordBase {
	cover: FileInput,
	profile: FileInput,
}

export type LogInArgs =
	InterfaceWithInput<LogInInput>

export type SignUpArgs =
	InterfaceWithInput<SignUpInput>

export interface LogInData {
	logIn: string,
}

export interface SignUpData {
	signUp: string,
}