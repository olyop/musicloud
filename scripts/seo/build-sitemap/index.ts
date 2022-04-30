import formatXML from "xml-formatter"
import { Readable } from "node:stream"
import { HOSTNAME } from "@oly_op/musicloud-common"
import { SitemapStream, streamToPromise } from "sitemap"

import generateLinks from "./generate-links"

const stream =
	new SitemapStream({ hostname: HOSTNAME })

const main =
	async () => {
		const links =
			await generateLinks()

		const xmlBuffer =
			await streamToPromise(Readable.from(links).pipe(stream))

		const xml =
			xmlBuffer.toString()
	}

void main()