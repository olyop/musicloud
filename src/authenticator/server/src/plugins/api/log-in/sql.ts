import { readFile } from "node:fs/promises";

export const SELECT_USER_BY_EMAIL = (
	await readFile(new URL("./select-user-by-email.sql", import.meta.url))
).toString();

export const SELECT_USER_PASSWORD = (
	await readFile(new URL("./select-user-password.sql", import.meta.url))
).toString();
