import { head as lodashHead } from "lodash"

export const head =
	<T>() =>
		(array: T[]) =>
			lodashHead<T>(array)!