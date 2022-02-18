export const timeStampToFullDate =
	(timeStamp: number) =>
		new Date(timeStamp).toLocaleDateString()