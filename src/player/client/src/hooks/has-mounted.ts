import { useRef, useEffect } from "react";

export const useHasMounted = () => {
	const hasMounted = useRef(false);
	useEffect(() => {
		hasMounted.current = true;
	}, []);
	return hasMounted.current;
};
