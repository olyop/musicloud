/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { registerRoute } from "workbox-routing"
import { offlineFallback } from "workbox-recipes"
import { precacheAndRoute } from "workbox-precaching"
// import { ExpirationPlugin } from "workbox-expiration"
import { RangeRequestsPlugin } from "workbox-range-requests"
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies"

// @ts-ignore
self.skipWaiting()

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST)

// @ts-ignore
self.__WB_DISABLE_DEV_LOGS = true

offlineFallback({
	pageFallback: "index.html",
})

// registerRoute(
// 	({ url }) =>
// 		url.origin === "https://fonts.googleapis.com",
// 	new StaleWhileRevalidate()
// )

// registerRoute(
// 	({ url }) =>
// 		url.origin === "https://fonts.gstatic.com",
// 	new CacheFirst({
// 		plugins: [
// 			new ExpirationPlugin({
// 				maxEntries: 30,
// 				maxAgeSeconds: 60 * 60 * 24 * 30,
// 			}),
// 		],
// 	})
// )

registerRoute(
	({ request }) =>
		request.destination === "style" ||
		request.destination === "script",
	new StaleWhileRevalidate(),
)

registerRoute(
	({ request }) =>
		request.destination === "image",
	new CacheFirst(),
)

registerRoute(
	({ url }) =>
		url.pathname.endsWith(".mp3"),
	new CacheFirst({
		plugins: [
			new RangeRequestsPlugin(),
		],
	}),
)