import fs from "fs"
import path from "path"

import { SERVER_PATH } from "../globals"

const TYPE_DEFS_PATH =
	path.join(SERVER_PATH, "type-defs")

const importFile =
	(fileName: string) =>
		`${fs.readFileSync(path.join(TYPE_DEFS_PATH, `${fileName}.gql`))}`

const typeDefs = [
	importFile("key"),
	importFile("user"),
	importFile("play"),
	importFile("song"),
	importFile("enums"),
	importFile("query"),
	importFile("genre"),
	importFile("album"),
	importFile("inputs"),
	importFile("unions"),
	importFile("artist"),
	importFile("scalars"),
	importFile("mutation"),
	importFile("playlist"),
]

export default typeDefs