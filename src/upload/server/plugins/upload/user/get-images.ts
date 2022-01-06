import path from "path"
import fs from "fs/promises"
import fetch from "node-fetch"

import { UPLOAD_PLUGINS_PATH } from "../../../globals"
import { UserCover, UserName, UserProfile } from "./types"

const DEFAULT_COVER_PATH =
	path.join(UPLOAD_PLUGINS_PATH, "user", "default-cover.jpg")

interface GetCoverOptions
	extends UserName, UserCover {}

export const getCover =
	async ({ cover }: GetCoverOptions) => {
		if (cover) {
			return cover[0]!.data
		} else {
			return fs.readFile(DEFAULT_COVER_PATH)
		}
	}

const createUIAvatarsURL =
	({ name }: UserName) => {
		const url = new URL("https://ui-avatars.com/api/")
		url.searchParams.append("size", "512")
		url.searchParams.append("color", "333")
		url.searchParams.append("background", "fafafa")
		url.searchParams.append("name", name.toLowerCase())
		return url
	}

interface GetProfileOptions
	extends UserName, UserProfile {}

export const getProfile =
	async ({ name, profile }: GetProfileOptions) => {
		if (profile) {
			return profile[0]!.data
		} else {
			const url = createUIAvatarsURL({ name }).toString()
			const response = await fetch(url)
			const arrayBuffer = await response.arrayBuffer()
			return Buffer.from(arrayBuffer)
		}
	}