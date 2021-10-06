export const blobToDataURL =
	(value: Blob) =>
		new Promise<string>(
			(resolve, reject) => {
				const reader = new FileReader()
				reader.onload = event => resolve(event.target!.result as string)
				reader.onerror = error => reject(error)
				reader.readAsDataURL(value)
			},
		)