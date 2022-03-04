import { compare } from "bcrypt"

const isPasswordCorrect =
	(inputPassword: string, hashedPassword: string) =>
		compare(inputPassword, hashedPassword)

export default isPasswordCorrect