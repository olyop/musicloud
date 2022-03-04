import { InterfaceWithInput } from "@oly_op/music-app-common/types"

import { OrderBy } from "./other"

export interface PageArgs {
	page: number | null,
}

export interface OrderByArgs {
	orderBy: OrderBy,
}

interface LibraryObjectsPaginatedInput
	extends PageArgs, OrderByArgs {}

export type LibraryObjectsPaginatedArgs =
	InterfaceWithInput<LibraryObjectsPaginatedInput>