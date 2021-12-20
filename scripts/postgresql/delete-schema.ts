import fs from "fs"
import path from "path"
import { Pool } from "pg"

const DELETE_SCHEMA =
	fs.readFileSync(
		path.join(process.cwd(), "src", "sql", "admin", "delete-schema.sql"),
	).toString()

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
			console.log(await pool.query(DELETE_SCHEMA))
		} catch (error) {
			console.error(error)
		}
	}

void main()