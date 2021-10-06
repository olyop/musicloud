import { determinePlural } from "./determine-plural"

const cases: [number, string][] =
	[[1, ""],[2, "s"]]

test.each(cases)(
	"correctly returns the right plural",
	(value, expected) => {
		expect(determinePlural(value)).toBe(expected)
	},
)