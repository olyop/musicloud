const isAudioBlocked =
	async () => {
		try {
			const context = new AudioContext()
			const isBlocked = context.state === "suspended"
			await context.close()
			return isBlocked
		} catch (error) {
			return false
		}
	}

export default isAudioBlocked