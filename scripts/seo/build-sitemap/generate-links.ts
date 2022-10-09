import knownLinks from "./known-links";
import generateAlbumLinks from "./generate-album-links";

const generateLinks = async () => [...(await generateAlbumLinks()), ...knownLinks];

export default generateLinks;
