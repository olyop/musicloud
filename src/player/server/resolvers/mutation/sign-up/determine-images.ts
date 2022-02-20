import { join } from "path"
import { createReadStream, ReadStream } from "fs"

import { SERVER_PATH } from "../../../globals"
import { InputCover, InputProfile } from "./types"

const DEFAULT_BASE_PATH =
	join(SERVER_PATH, "resolvers", "mutation", "sign-up")

const DEFAULT_COVER_PATH =
	join(DEFAULT_BASE_PATH, "default-cover.jpg")

const DEFAULT_PROFILE_PATH =
	join(DEFAULT_BASE_PATH, "default-profile.jpg")

const readStreamToBuffer =
	(stream: ReadStream) =>
		new Promise<Buffer>(
			(resolve, reject) => {
				const chunks: Buffer[] = []

				stream.on("data", chunk => {
					if (Buffer.isBuffer(chunk)) {
						chunks.push(chunk)
					}
				})

				stream.on("end", () => {
					resolve(Buffer.concat(chunks))
				})

				stream.on("error", reject)
			},
		)

export const determineCover =
	({ cover }: InputCover) =>
		readStreamToBuffer(
			cover ?
				cover.createReadStream() :
				createReadStream(DEFAULT_COVER_PATH)
		)

export const determineProfile =
	({ profile }: InputProfile) =>
		readStreamToBuffer(
			profile ?
				profile.createReadStream() :
				createReadStream(DEFAULT_PROFILE_PATH)
		)