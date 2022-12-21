const numberFormatter = new Intl.NumberFormat("en", {
	notation: "compact",
});

export const formatPlays = (plays: number) => numberFormatter.format(plays);
