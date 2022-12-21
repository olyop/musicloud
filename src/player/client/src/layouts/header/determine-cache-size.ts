const textEncoder = new TextEncoder();

export const determineCacheSize = () => {
	const apolloCachePersist = localStorage.getItem("apollo-cache-persist");
	if (apolloCachePersist) {
		return textEncoder.encode(apolloCachePersist).length;
	} else {
		return null;
	}
};
