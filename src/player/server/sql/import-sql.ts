import fs from "fs"
import path from "path"
import { isUndefined } from "lodash"

import { SQL_PATH } from "../globals"

const filterUndefined =
	(...paths: (string | undefined)[]) =>
		(paths.filter(p => !isUndefined(p)) as unknown) as string[]

const importSQL =
	(folder: string) =>
		(subFolder?: string) =>
			(fileName: string) =>
				fs.readFileSync(path.join(...filterUndefined(SQL_PATH, folder, subFolder, `${fileName}.sql`)))
					.toString()

export default importSQL