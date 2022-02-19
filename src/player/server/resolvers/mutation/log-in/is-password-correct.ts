import { compare } from "bcrypt"

const isPasswordCorrect =
	(inputPassword: string, databasePassword: string) =>
		compare(inputPassword, databasePassword)

export default isPasswordCorrect