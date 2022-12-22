import { updatePlay, useDispatch } from "../redux";

export const useResetPlayer = () => {
	const dispatch = useDispatch();
	return () => {
		dispatch(updatePlay(false));
	};
};
