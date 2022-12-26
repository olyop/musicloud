import { readFile } from "node:fs/promises";

import { InputCover, InputProfile } from "./types.js";

const DEFAULT_COVER_PATH = new URL("default-cover.jpg", import.meta.url);

const DEFAULT_PROFILE_PATH = new URL("default-profile.jpg", import.meta.url);

export const determineCover = async ({ cover }: InputCover) =>
	cover || (await readFile(DEFAULT_COVER_PATH));

export const determineProfile = async ({ profile }: InputProfile) =>
	profile || (await readFile(DEFAULT_PROFILE_PATH));
