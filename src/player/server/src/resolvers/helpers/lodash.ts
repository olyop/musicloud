import {
	head as lodashHead,
	shuffle as lodashShuffle,
	includes as lodashIncludes,
} from "lodash-es"

export const map =
	<U, T>(callback: (value: T, index: number) => U) =>
		(array: T[]) =>
			array.map(callback)

export const head =
	<T>() =>
		(array: T[]) =>
			lodashHead<T>(array)!

export const shuffle =
	<T>() =>
		(array: T[]) =>
			lodashShuffle<T>(array)

export const includes =
	<T>(target: T) =>
		(array: T[]) =>
			lodashIncludes<T>(array, target)