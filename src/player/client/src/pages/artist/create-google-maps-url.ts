import { Artist } from "../../types";

const googleMapsBaseURL = "https://www.google.com.au/maps/search";

const createGoogleMapsURL = (artist: Pick<Artist, "city" | "country">) => {
	const city = artist.city!.toLowerCase().replace(" ", "+");
	const country = artist.country!.toLowerCase().replace(" ", "+");
	return `${googleMapsBaseURL}/${city}+${country}`;
};

export default createGoogleMapsURL;
