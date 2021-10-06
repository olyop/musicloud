const deserializeDuration =
	(duration: number, wordFormat = false): string => {
		const minutes = Math.floor(duration / 60)
		const seconds = duration % 60
		if (wordFormat) {
			return `${minutes} minutes`
		} else {
			return `${minutes}:${seconds <= 9 ? "0" : ""}${seconds}`
		}
	}

export default deserializeDuration