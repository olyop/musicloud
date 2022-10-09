export type ObserverInstanceCallback = (inView: boolean, entry: IntersectionObserverEntry) => void;

export interface IntersectionOptions extends IntersectionObserverInit {
	skip?: boolean;
	delay?: number;
	rootMargin?: string;
	root?: Element | null;
	triggerOnce?: boolean;
	initialInView?: boolean;
	fallbackInView?: boolean;
	trackVisibility?: boolean;
	threshold?: number | number[];
	onChange?: ObserverInstanceCallback;
}

export interface State {
	inView: boolean;
	entry?: IntersectionObserverEntry;
}

export type InViewHookResponse = [(node?: Element | null) => void, boolean];
