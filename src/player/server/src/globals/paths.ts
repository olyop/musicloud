import path from "path"

export const ROOT_PATH = process.cwd()
export const SERVER_PATH = path.join(ROOT_PATH, "build", "player")
export const SQL_PATH = path.join(SERVER_PATH, "sql")