import fs from "fs"
import path from "path"
import { Pool } from "pg"

const SQL_PATH =
	path.join(process.cwd(), "src", "sql")

const importSQL =
	(basePath: string) =>
		(fileName: string) =>
			fs.readFileSync(path.join(basePath, `${fileName}.sql`))
				.toString()

const importSQLType =
	importSQL(path.join(SQL_PATH, "types"))

const importSQLTable =
	importSQL(path.join(SQL_PATH, "tables"))

const TABLE_KEYS = importSQLTable("keys")
const TABLE_USERS = importSQLTable("users")
const TABLE_SONGS = importSQLTable("songs")
const TABLE_PLAYS = importSQLTable("plays")
const TABLE_GENRES = importSQLTable("genres")
const TABLE_ALBUMS = importSQLTable("albums")
const TABLE_ARTISTS = importSQLTable("artists")
const TABLE_PLAYLISTS = importSQLTable("playlists")
const TABLE_NOW_PLAYING = importSQLTable("now-playing")
const TABLE_QUEUE_NEXTS = importSQLTable("queue-nexts")
const TABLE_SONGS_GENRES = importSQLTable("songs-genres")
const TABLE_QUEUE_LATERS = importSQLTable("queue-laters")
const TABLE_SONGS_ARTISTS = importSQLTable("songs-artists")
const TABLE_LIBRARY_SONGS = importSQLTable("library-songs")
const TABLE_ALBUMS_ARTISTS = importSQLTable("albums-artists")
const TABLE_QUEUE_PREVIOUS = importSQLTable("queue-previous")
const TABLE_SONGS_REMIXERS = importSQLTable("songs-remixers")
const TYPE_PLAYLIST_PRIVACY = importSQLType("playlist_privacy")
const TABLE_PLAYLISTS_SONGS = importSQLTable("playlists-songs")
const TABLE_LIBRARY_ARTISTS = importSQLTable("library-artists")
const TABLE_SONGS_FEATURINGS = importSQLTable("songs-featurings")
const TABLE_LIBRARY_PLAYLISTS = importSQLTable("library-playlists")

const files = [
	TABLE_KEYS,
	TABLE_USERS,
	TABLE_GENRES,
	TABLE_ARTISTS,
	TABLE_ALBUMS,
	TABLE_ALBUMS_ARTISTS,
	TABLE_SONGS,
	TABLE_SONGS_GENRES,
	TABLE_SONGS_ARTISTS,
	TABLE_SONGS_REMIXERS,
	TABLE_SONGS_FEATURINGS,
	TABLE_PLAYS,
	TABLE_NOW_PLAYING,
	TYPE_PLAYLIST_PRIVACY,
	TABLE_PLAYLISTS,
	TABLE_PLAYLISTS_SONGS,
	TABLE_QUEUE_NEXTS,
	TABLE_QUEUE_LATERS,
	TABLE_QUEUE_PREVIOUS,
	TABLE_LIBRARY_SONGS,
	TABLE_LIBRARY_ARTISTS,
	TABLE_LIBRARY_PLAYLISTS,
]

const pool =
	new Pool({
		parseInputDatesAsUTC: true,
		idleTimeoutMillis: 1000 * 2,
		user: process.env.AWS_RDS_USERNAME,
		host: process.env.AWS_RDS_ENDPOINT,
		password: process.env.AWS_RDS_PASSWORD,
		database: process.env.AWS_RDS_DATABASE,
	})

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