/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import { RandomOrgClient } from "@randomorg/core";
// import { isEmpty, isNull } from "lodash-es"
import { shuffle as lodashShuffle } from "lodash-es";

export const shuffle =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars


		(randomOrg: RandomOrgClient) =>
		// eslint-disable-next-line @typescript-eslint/require-await
		async <T>(array: T[] | null) => {
			// if (isNull(array) || isEmpty(array)) {
			// 	return []
			// } else {
			// 	const { length } = array
			// 	const newArray = new Array<T>(length)

			// 	const result =
			// 		await randomOrg.generateIntegers(
			// 			length,
			// 			0,
			// 			length - 1,
			// 			{ replacement: false },
			// 		)

			// 	const randomIndexes =
			// 		(result as number[]) as (keyof T)[]

			// 	randomIndexes.forEach((value, index) => {
			// 		// @ts-ignore
			// 		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			// 		newArray[index] = array[value]
			// 	})

			// 	return newArray
			// }
			return lodashShuffle(array);
		};
