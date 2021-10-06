export const dataURLToBuffer =
	(dataURL: string) =>
		Buffer.from(dataURL.split(",")[1], "base64")