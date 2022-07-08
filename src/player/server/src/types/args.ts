import { InterfaceWithInput } from "@oly_op/musicloud-common"

import { OrderBy } from "./other"

export interface PageArgs {
	page: number | null,
}

export interface OrderByArgs {
	orderBy: OrderBy,
}

interface LibraryObjectAtIndexInput
	extends OrderByArgs {
	atIndex: number,
}

export type LibraryObjectAtIndexArgs =
	InterfaceWithInput<LibraryObjectAtIndexInput>