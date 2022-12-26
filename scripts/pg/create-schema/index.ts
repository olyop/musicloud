import fs from "node:fs";
import path from "node:path";

import { PG_POOL_OPTIONS } from "@oly_op/musicloud-common/build/server-options";
import { Pool } from "pg";

const database = new Pool(PG_POOL_OPTIONS);

const SQL_PATH = new URL("sql", import.meta.url).pathname;

const importSQL = (folderName: string, fileName: string) =>
	fs.readFileSync(path.join(SQL_PATH, folderName, `${fileName}.sql`)).toString();

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
	importSQL("tables", "albums-remixers"),
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
];

await database.tx(async client => {
	for (const file of files) {
		await client.none(file);
	}
});
