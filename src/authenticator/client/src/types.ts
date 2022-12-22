import {
	InterfaceWithInput,
	UserBase,
	UserEmailAddressBase,
	UserPasswordBase,
} from "@oly_op/musicloud-common/build/types";

export interface LogInInput extends UserPasswordBase, UserEmailAddressBase {}

type FileInput = File | null;

export interface SignUpInput extends UserPasswordBase, Omit<UserBase, "userID" | "dateJoined"> {
	cover: FileInput;
	profile: FileInput;
}

export type LogInArgs = InterfaceWithInput<LogInInput>;

export type SignUpArgs = InterfaceWithInput<SignUpInput>;

export interface LogInData {
	logIn: string;
}

export interface SignUpData {
	signUp: string;
}
