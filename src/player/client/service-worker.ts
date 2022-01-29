/* eslint-disable no-underscore-dangle */
import { offlineFallback } from "workbox-recipes"
import { precacheAndRoute } from "workbox-precaching"
import { RangeRequestsPlugin } from "workbox-range-requests"
import { registerRoute, setDefaultHandler } from "workbox-routing"
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies"

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
self.skipWaiting()

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
precacheAndRoute(self.__WB_MANIFEST)

// @ts-ignore
self.__WB_DISABLE_DEV_LOGS = true

setDefaultHandler(
	new NetworkOnly(),
)

offlineFallback({ pageFallback: "index.html" })

registerRoute(
	({ url }) =>
		url.origin === "https://fonts.googleapis.com",
	new StaleWhileRevalidate({
		cacheName: "google-fonts-stylesheets",
	}),
)

registerRoute(
	({ url }) =>
		url.origin === "https://fonts.gstatic.com",
	new CacheFirst({
		cacheName: "google-fonts-webfonts",
	}),
)

registerRoute(
	({ request }) =>
		request.destination === "style" ||
		request.destination === "script",
	new StaleWhileRevalidate({
		cacheName: "bundles",
	}),
)

registerRoute(
	({ request }) =>
		request.destination === "image",
	new CacheFirst({
		cacheName: "images",
	}),
)

registerRoute(
	({ url }) =>
		url.pathname.endsWith(".mp3"),
	new CacheFirst({
		cacheName: "audio",
		plugins: [
			new RangeRequestsPlugin(),
		],
	}),
)