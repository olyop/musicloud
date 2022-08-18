import {
	pageCache,
	imageCache,
	offlineFallback,
	googleFontsCache,
	staticResourceCache,
} from "workbox-recipes"

import { clientsClaim } from "workbox-core"
import { registerRoute } from "workbox-routing"
import { ExpirationPlugin } from "workbox-expiration"
import { RangeRequestsPlugin } from "workbox-range-requests"
import { CacheFirst, NetworkOnly } from "workbox-strategies"

declare const self: ServiceWorkerGlobalScope

// eslint-disable-next-line no-underscore-dangle
self.__WB_DISABLE_DEV_LOGS = true

clientsClaim()

await self.skipWaiting()

pageCache()

googleFontsCache()

registerRoute(
	({ url }) => url.pathname.endsWith(".mp3"),
	new CacheFirst({
		cacheName: "mp3s",
		plugins: [
			new RangeRequestsPlugin(),
			new ExpirationPlugin({
				maxEntries: Infinity,
				maxAgeSeconds: Infinity,
			}),
		],
	}),
)

registerRoute(
	({ url }) => url.pathname === "/ping.txt",
	new NetworkOnly(),
)

staticResourceCache()

imageCache({
	maxEntries: Infinity,
	maxAgeSeconds: Infinity,
})

offlineFallback({
	pageFallback: "index.html",
})