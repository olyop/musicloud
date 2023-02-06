export const parseReleased = (value: string) => {
	const now = Date.now();
	const date = new Date(value);

	if (date.toString() === "Invalid Date") {
		throw new Error("Released date could not be parsed");
	}

	const released = date.valueOf();

	if (released > now) {
		throw new Error("Released date cannot be in the future");
	}

	return released;
};
