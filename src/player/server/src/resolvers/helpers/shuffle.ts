/* eslint-disable max-len */
import { RandomOrgClient } from "@randomorg/core"

export const shuffle =
	(randomOrg: RandomOrgClient) =>
		async <T>(array: T[]) => {
			const { length } = array
			const newArray = new Array<T>(length)

			const result =
				await randomOrg.generateIntegers(
					length,
					0,
					length - 1,
					{ replacement: false },
				)

			const randomIndexes =
				(result as number[]) as (keyof T)[]

			randomIndexes.forEach((value, index) => {
				// @ts-ignore
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				newArray[index] = array[value]
			})

			return newArray
		}