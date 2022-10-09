import { addDashesToUUID } from "@oly_op/uuid-dashes";

const getArtistIDFromURL = (url: string) => addDashesToUUID(url.slice(8, 40));

export default getArtistIDFromURL;
