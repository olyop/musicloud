import { BASE_S3_URL } from "@oly_op/music-app-common/globals"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import { determineCatalogImageURL } from "./determine-catalog-image-url"

const cases: [[string, string, ImageSizes, ImageDimensions], string][] = [
	[
		[
			"7ab82a9f-164b-4759-9454-5a0947087431",
			"photo",
			ImageSizes.FULL,
			ImageDimensions.LANDSCAPE,
		],
		"/catalog/7ab82a9f164b475994545a0947087431/photo/full-landscape.jpg",
	],
	[
		[
			"b4576433-6b00-4326-940c-6b06c5a68165",
			"cover",
			ImageSizes.HALF,
			ImageDimensions.SQUARE,
		],
		"/catalog/b45764336b004326940c6b06c5a68165/cover/half-square.jpg",
	],
	[
		[
			"2efb540d-e552-49ee-b809-b7461a77b8c0",
			"profile",
			ImageSizes.MINI,
			ImageDimensions.SQUARE,
		],
		"/catalog/2efb540de55249eeb809b7461a77b8c0/profile/mini-square.jpg",
	],
]

test.each(cases)(
	"correctly returns the catalog url",
	(args, expected) => {
		expect(determineCatalogImageURL(...args)).toBe(`${BASE_S3_URL}${expected}`)
	},
)