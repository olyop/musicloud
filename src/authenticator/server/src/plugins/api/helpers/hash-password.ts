import { genSalt, hash } from "bcrypt";

export const hashPassword = async (password: string) => hash(password, await genSalt());
