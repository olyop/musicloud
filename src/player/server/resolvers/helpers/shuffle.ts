import { shuffle as lodashShuffle } from "lodash"

export const shuffle =
	<T>() =>
		(array: T[]) =>
			lodashShuffle<T>(array)