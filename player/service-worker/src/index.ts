import {
	pageCache,
	imageCache,
	offlineFallback,
	googleFontsCache,
	staticResourceCache,
} from "workbox-recipes"

import { clientsClaim } from "workbox-core"
import { CacheFirst } from "workbox-strategies"
import { registerRoute } from "workbox-routing"
import { RangeRequestsPlugin } from "workbox-range-requests"

declare const self: ServiceWorkerGlobalScope

void self.skipWaiting()

clientsClaim()

self.__WB_DISABLE_DEV_LOGS = true

pageCache()

googleFontsCache()

staticResourceCache()

imageCache()

registerRoute(
	({ url }) =>
		url.pathname.endsWith(".mp3"),
	new CacheFirst({
		plugins: [
			new RangeRequestsPlugin(),
		],
	}),
)

offlineFallback({
	pageFallback: "index.html",
})