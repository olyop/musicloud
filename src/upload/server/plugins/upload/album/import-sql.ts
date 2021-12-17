import { join } from "path"
import { readFileSync } from "fs"

import { UPLOAD_PLUGINS_PATH } from "../../../globals"

const importSQL =
	(fileName: string) =>
		readFileSync(join(UPLOAD_PLUGINS_PATH, "album", `${fileName}.sql`)).toString()

export default importSQL