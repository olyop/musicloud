import { OrderBy } from "./other"

export interface PageArgs {
	page: number | null,
}

export interface OrderByArgs {
	orderBy?: OrderBy,
}