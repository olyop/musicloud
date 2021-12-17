import { Item } from "./types"

const createList =
	(items: Item[]) => {
		const values = items.map(({ value }) => value)
		const finalValue = values.pop()!
		return (
			values.length ?
				`${values.join(", ")} & ${finalValue}` :
				finalValue
		)
	}

export default createList