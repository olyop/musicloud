import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { ImageSizes, ImageDimensions } from "@oly_op/music-app-common/types"

import { determineCatalogImageURL } from "../../helpers"

const downloadCover =
	async (albumID: string) => {
		const url =
			determineCatalogImageURL(
				albumID,
				"cover",
				ImageSizes.FULL,
				ImageDimensions.SQUARE,
			)

		const response =
			await fetch(url, { mode: "no-cors" })

		const reader =
			response.body!.getReader()

		const chunks: Uint8Array[] = []

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const { value, done } = await reader.read()
			chunks.push(value!)
			if (done) break
		}

		const blob = new Blob(chunks)
		const blobURL = window.URL.createObjectURL(blob)
		const anchor = document.createElement("a")
		anchor.href = blobURL
		anchor.download = `${removeDashesFromUUID(albumID)}.jpg`
		document.body.appendChild(anchor)
		anchor.click()
		anchor.remove()
	}

export default downloadCover