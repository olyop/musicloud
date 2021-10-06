import { BASE_S3_URL } from "@oly_op/music-app-common/globals"

import { determineCatalogMP3URL } from "./determine-catalog-mp3-url"

const cases: [string, string][] = [
	["1", `${BASE_S3_URL}/catalog/1/full.mp3`],
	["2", `${BASE_S3_URL}/catalog/2/full.mp3`],
	["3", `${BASE_S3_URL}/catalog/3/full.mp3`],
]

test.each(cases)(
	"correctly returns the catalog url",
	(value, expected) => {
		expect(determineCatalogMP3URL(value)).toBe(expected)
	},
)