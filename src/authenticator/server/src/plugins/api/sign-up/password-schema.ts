/* eslint-disable newline-per-chained-call */
import { readFile } from "node:fs/promises"
import PasswordValidator from "password-validator"

const compromisedPasswordsFile =
	await readFile(new URL("./compromised-passwords.txt", import.meta.url))

const compromisedPasswords =
	compromisedPasswordsFile.toString().split("\n")

const passwordSchema =
	new PasswordValidator()

passwordSchema
	.is().min(8)
	.is().max(100)
	.has().uppercase()
	.has().lowercase()
	.has().digits(2)
	.has().not().spaces()
	.is().not().oneOf(compromisedPasswords)

export default passwordSchema