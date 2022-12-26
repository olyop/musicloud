import { InterfaceWithInput } from "@oly_op/musicloud-common/build/types";

import { OrderBy } from "./other.js";

export interface OrderByArgs {
	orderBy: OrderBy;
}

interface LibraryObjectAtIndexInput extends OrderByArgs {
	atIndex: number;
}

export type LibraryObjectAtIndexArgs = InterfaceWithInput<LibraryObjectAtIndexInput>;
