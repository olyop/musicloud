import { useCallback, useRef, useEffect } from "react";

import { State, InViewHookResponse, IntersectionOptions, ObserverInstanceCallback } from "./types";

import observe from "./observe";

export const useInView = (options: IntersectionOptions = {}): InViewHookResponse => {
	const {
		root,
		skip,
		delay,
		onChange,
		threshold,
		rootMargin,
		triggerOnce,
		initialInView,
		fallbackInView,
		trackVisibility,
	} = options;

	const unobserve = useRef<() => void>();
	const callback = useRef<IntersectionOptions["onChange"]>();

	const stateRef = useRef<State>({ inView: !!initialInView });

	callback.current = onChange;

	const setRef = useCallback(
		(node?: Element | null) => {
			if (unobserve.current !== undefined) {
				unobserve.current();
				unobserve.current = undefined;
			}

			if (skip) {
				return;
			}

			if (node) {
				unobserve.current = observe(
					node,
					(inView, entry) => {
						stateRef.current = {
							inView,
							entry,
						};

						if (callback.current) {
							callback.current(inView, entry);
						}

						if (entry.isIntersecting && triggerOnce && unobserve.current) {
							unobserve.current();
							unobserve.current = undefined;
						}
					},
					{
						root,
						rootMargin,
						threshold,
						// @ts-ignore
						trackVisibility,
						delay,
					},
					fallbackInView,
				);
			}
		},
		[
			Array.isArray(threshold) ? threshold.toString() : threshold,
			root,
			rootMargin,
			triggerOnce,
			skip,
			trackVisibility,
			fallbackInView,
			delay,
		],
	);

	useEffect(() => {
		if (!unobserve.current && stateRef.current.entry && !triggerOnce && !skip) {
			stateRef.current = {
				inView: !!initialInView,
			};
		}
	});

	return [setRef, stateRef.current.inView];
};

export {
	IntersectionOptions as UseInViewOptions,
	ObserverInstanceCallback as UseInViewOptionsOnChange,
};
