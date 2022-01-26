const fastifyListenCallback =
	(error: Error | null, address: string) => {
		if (error) {
			console.error(error)
		} else {
			if (process.env.NODE_ENV === "production") {
				console.log(address)
			}
		}
	}

export default fastifyListenCallback