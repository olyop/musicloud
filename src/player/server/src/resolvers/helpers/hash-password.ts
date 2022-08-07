import { hash, genSalt } from "bcrypt"
import { UserPasswordBase } from "@oly_op/musicloud-common/build/types"

export const hashPassword =
	async ({ password }: UserPasswordBase) =>
		hash(
			password,
			await genSalt(),
		)