import fs from "fs";
import path from "path";
import { isUndefined } from "lodash-es";

const SQL_ROOT_PATH = new URL(".", import.meta.url).pathname;

const filterUndefined = (...paths: (string | undefined)[]) =>
	paths.filter(p => !isUndefined(p)) as unknown as string[];

const importSQL = (folder: string) => (subFolder?: string) => (fileName: string) =>
	fs
		.readFileSync(
			path.join(...filterUndefined(SQL_ROOT_PATH, folder, subFolder, `${fileName}.sql`)),
		)
		.toString();

export default importSQL;
