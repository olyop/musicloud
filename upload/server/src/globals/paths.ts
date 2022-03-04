import path from "path"

export const ROOT_PATH = process.cwd()
export const SERVER_PATH = path.join(ROOT_PATH, "build", "upload")
export const PUBLIC_PATH = path.join(SERVER_PATH, "public")
export const CLIENT_ENTRY_PATH = path.join(PUBLIC_PATH, "index.html")
export const UPLOAD_PLUGINS_PATH = path.join(SERVER_PATH, "plugins", "upload")