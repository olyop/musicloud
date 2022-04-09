import { FileUpload } from "graphql-upload"
import { ImageDimensions, ImageSizes, UserPasswordBase } from "@oly_op/musicloud-common"

import { User } from "../../../types"

export interface ImageInput {
	name: string,
	size: ImageSizes,
	dimension: ImageDimensions,
}

export type FileInput =
	Promise<FileUpload>

export type FileInputOrNull =
	FileInput | null

export interface InputCover {
	cover: FileInputOrNull,
}

export interface InputProfile {
	profile: FileInputOrNull,
}

export interface InputBase
	extends
	UserPasswordBase,
	Omit<User, "userID" | "dateJoined"> {}

export interface Input
	extends
	InputBase,
	InputCover,
	InputProfile {}

export interface Args {
	input: Input,
}