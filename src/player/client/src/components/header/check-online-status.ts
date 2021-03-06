const timeout =
	(promise: Promise<unknown>) =>
		new Promise(
			(resolve, reject) => {
				setTimeout(() => {
					reject(new Error("Request timed out."))
				}, 3000)
				promise.then(resolve, reject)
			},
		)

const checkOnlineStatus =
	async () => {
		const controller =
			new AbortController()
		if (!navigator.onLine) {
			return navigator.onLine
		} else {
			try {
				await timeout(
					fetch("/ping.txt", {
						method: "GET",
						signal: controller.signal,
					}),
				)
				return true
			} catch (error) {
				controller.abort()
				return false
			}
		}
	}

export default checkOnlineStatus