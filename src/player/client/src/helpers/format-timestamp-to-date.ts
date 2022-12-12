const dateFormatter = new Intl.DateTimeFormat("en");

export const formatTimestampToDate = (date: number) => dateFormatter.format(date);
