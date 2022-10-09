import { EnumChangefreq } from "sitemap";

import { Link } from "./types";

const knownLinks: Link[] = [
	{
		url: "/",
		priority: 1,
		changefreq: EnumChangefreq.ALWAYS,
	},
	{
		priority: 0.9,
		url: "/top-one-hundred-songs",
		changefreq: EnumChangefreq.ALWAYS,
	},
	{
		priority: 0.7,
		url: "/search",
		changefreq: EnumChangefreq.ALWAYS,
	},
];

export default knownLinks;
