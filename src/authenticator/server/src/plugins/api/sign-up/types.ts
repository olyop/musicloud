import {
	NameBase,
	ImageSizes,
	AccessToken,
	ImageDimensions,
	UserPasswordBase,
	UserEmailAddressBase,
} from "@oly_op/musicloud-common"

import {
	MultipartFile,
	MultipartValue,
} from "@fastify/multipart"

export interface ImageInput {
	name: string,
	size: ImageSizes,
	dimension: ImageDimensions,
}

type FileInput =
	Buffer | null

export interface InputCover {
	cover: FileInput,
}

export interface InputProfile {
	profile: FileInput,
}

export interface InputImages
	extends InputCover, InputProfile {}

interface BodyBase
	extends
	NameBase,
	UserPasswordBase,
	UserEmailAddressBase {}

export interface Body
	extends
	BodyBase,
	InputCover,
	InputProfile {}

export interface Route {
	Reply: AccessToken,
}

// @fastify/multipart request.parts() fix
interface PartBase<T> {
	fieldname: keyof T,
}

interface PartFile
	extends
	PartBase<InputImages>,
	Partial<MultipartValue<"null">>,
	Omit<MultipartFile, "fieldname"> {}

interface PartValue
	extends
	PartBase<BodyBase>,
	MultipartValue<BodyBase[keyof BodyBase]> {}

export type Part =
	PartFile | PartValue

export const isPartFile =
	(part: Part): part is PartFile =>
		part.fieldname === "cover" ||
		part.fieldname === "profile"