const fileListToDataURL =
	(files: FileList) =>
		new Promise<string>(
			(resolve, reject) => {
				const file = files![0]
				const blob = new Blob([file], { type: "image/jpeg" })
				const reader = new FileReader()
				reader.readAsDataURL(blob)
				reader.onload = event => {
					resolve(event.target!.result as string)
				}
				reader.onerror = error => {
					reject(error)
				}
			},
		)

export default fileListToDataURL