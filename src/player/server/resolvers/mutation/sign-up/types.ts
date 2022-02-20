import { FileUpload } from "graphql-upload"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import { User } from "../../../types"

export interface ImageInput {
	name: string,
	size: ImageSizes,
	dimension: ImageDimensions,
}

type InputFile =
	FileUpload | null

export interface InputCover {
	cover: InputFile,
}

export interface InputProfile {
	profile: InputFile,
}

export type InputBase =
	Omit<User, "userID" | "dateJoined">

export interface Input
	extends
	InputBase,
	InputCover,
	InputProfile {}

export interface Args {
	input: Input,
}