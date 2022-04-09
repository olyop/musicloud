import { SitemapItem } from "sitemap"

export type Link =
	Omit<SitemapItem, "img" | "video" | "links">