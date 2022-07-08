import { hash, genSalt } from "bcrypt"
import { UserPasswordBase } from "@oly_op/musicloud-common"

export const hashPassword =
	async ({ password }: UserPasswordBase) =>
		hash(
			password,
			await genSalt(),
		)