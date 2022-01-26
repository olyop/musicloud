import fs from "fs"
import path from "path"
import { Pool } from "pg"
import { PG_POOL_OPTIONS } from "@oly_op/music-app-common/options"

const SQL_PATH =
	path.join(process.cwd(), "src", "sql")

const importSQL =
	(folderName: string, fileName: string) =>
		fs.readFileSync(path.join(SQL_PATH, folderName, `${fileName}.sql`))
			.toString()

const files = [
	importSQL("types", "playlist-privacy"),
	importSQL("functions", "get-now"),
	importSQL("tables", "keys"),
	importSQL("tables", "users"),
	importSQL("tables", "users-followers"),
	importSQL("tables", "genres"),
	importSQL("tables", "artists"),
	importSQL("tables", "albums"),
	importSQL("tables", "albums-artists"),
	importSQL("tables", "songs"),
	importSQL("tables", "songs-genres"),
	importSQL("tables", "songs-artists"),
	importSQL("tables", "songs-remixers"),
	importSQL("tables", "songs-featurings"),
	importSQL("tables", "plays"),
	importSQL("tables", "now-playing"),
	importSQL("tables", "playlists"),
	importSQL("tables", "playlists-songs"),
	importSQL("tables", "queue-nexts"),
	importSQL("tables", "queue-laters"),
	importSQL("tables", "queue-previous"),
	importSQL("tables", "library-songs"),
	importSQL("tables", "library-artists"),
	importSQL("tables", "library-playlists"),
]

const pool =
	new Pool(PG_POOL_OPTIONS)

const main =
	async () => {
		try {
			for (const file of files) {
				console.log(await pool.query(file))
			}
		} catch (error) {
			console.error(error)
		}
	}

void main()