/* eslint-disable no-constant-condition */
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

import { Album } from "../../types"
import { createCatalogMP3URL } from "../../helpers"

const downloadSongs =
	async ({ songs }: Album) => {
		for (const { songID } of songs) {
			const url = createCatalogMP3URL(songID)
			const response = await fetch(url)
			const reader = response.body!.getReader()
			const chunks: Uint8Array[] = []
			while (true) {
				const { value, done } = await reader.read()
				chunks.push(value!)
				if (done) break
			}
			const blob = new Blob(chunks)
			const blobURL = window.URL.createObjectURL(blob)
			const anchor = document.createElement("a")
			anchor.href = blobURL
			anchor.download = `${removeDashesFromUUID(songID)}.mp3`
			document.body.appendChild(anchor)
			anchor.click()
			anchor.remove()
		}
	}

export default downloadSongs