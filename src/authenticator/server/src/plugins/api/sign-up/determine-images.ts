import { readFile } from "node:fs/promises"

import { InputCover, InputProfile } from "./types"

const DEFAULT_COVER_PATH =
	new URL("./default-cover.jpg", import.meta.url).toString()

const DEFAULT_PROFILE_PATH =
	new URL("./default-profile.jpg", import.meta.url).toString()

export const determineCover =
	async ({ cover }: InputCover) =>
		cover || readFile(DEFAULT_COVER_PATH)

export const determineProfile =
	async ({ profile }: InputProfile) =>
		profile || readFile(DEFAULT_PROFILE_PATH)