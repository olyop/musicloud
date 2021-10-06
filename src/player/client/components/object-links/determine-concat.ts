import { ObjectLinkOptions } from "../object-link"

const determineConcat =
	(links: ObjectLinkOptions[], index: number, ampersand = true) => {
		if (links.length - 2 === index && ampersand) {
			return " & "
		} else if (links.length - 1 === index) {
			return null
		} else {
			return ", "
		}
	}

export default determineConcat