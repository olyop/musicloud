import { compare } from "bcrypt";

export const isPasswordCorrect = (password: string, hashedPassword: string) =>
	compare(password, hashedPassword);
