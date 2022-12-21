const dateFormatter = new Intl.DateTimeFormat();

export const formatTimestamp = (date: number) => dateFormatter.format(date);
