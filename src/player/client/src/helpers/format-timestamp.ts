const dateFormatter = new Intl.DateTimeFormat();
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: "short",
	timeStyle: "short",
});

export const formatTimestampToDate = (date: number) => dateFormatter.format(date);
export const formatTimestampToDateTime = (date: number) => dateTimeFormatter.format(date);
