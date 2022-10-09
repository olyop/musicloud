const baseURL = "https://google.com/search";

export const createGoogleSearchURL = ({ query, isImage = false }: Options) => {
	const url = new URL(baseURL);

	url.searchParams.append("q", query.toLowerCase());

	if (isImage) {
		url.searchParams.append("tbm", "isch");
	}

	return url.toString();
};

interface Options {
	query: string;
	isImage?: boolean;
}
