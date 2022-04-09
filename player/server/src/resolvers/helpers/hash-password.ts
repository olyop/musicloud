import { hash, genSalt } from "bcrypt"
import { UserPasswordBase } from "@oly_op/musicloud-common"

const salt =
	await genSalt()

export const hashPassword =
	async ({ password }: UserPasswordBase) =>
		hash(password, salt)