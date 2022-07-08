import { ObserverInstanceCallback } from "./types"

interface ObserverInstance {
	id: string,
	observer: IntersectionObserver,
	elements: Map<Element, Array<ObserverInstanceCallback>>,
}

const observerMap =
	new Map<string, ObserverInstance>()

const RootIDs: WeakMap<Element | Document, string> =
	new WeakMap()

let rootId = 0
let unsupportedValue: boolean | undefined

export const defaultFallbackInView =
	(inView: boolean | undefined) => {
		unsupportedValue = inView
	}

const getRootID =
	(root: IntersectionObserverInit["root"]) => {
		if (!root) return "0"
		if (RootIDs.has(root)) return RootIDs.get(root)!
		rootId += 1
		RootIDs.set(root, rootId.toString())
		return RootIDs.get(root) as string
	}

export const optionsToID =
	(options: IntersectionObserverInit) => {
		const keysTyped = Object.keys(options) as Array<keyof typeof options>
		return (
			keysTyped
				.sort()
				.filter(key => options[key] !== undefined)
				.map(key => `${key}_${key === "root" ? getRootID(options.root) : options[key] as string}`)
				.toString()
		)
	}

const createObserver =
	(options: IntersectionObserverInit) => {
		const id = optionsToID(options)
		let instance = observerMap.get(id)

		if (!instance) {
			const elements = new Map<Element, Array<ObserverInstanceCallback>>()

			let thresholds: number[] | readonly number[]

			const observer =
				new IntersectionObserver(
					entries => {
						entries.forEach(
							entry => {
								const inView =
									entry.isIntersecting &&
									thresholds.some(threshold => entry.intersectionRatio >= threshold)

								// @ts-ignore
								if (options.trackVisibility && typeof entry.isVisible === "undefined") {
									// @ts-ignore
									// eslint-disable-next-line no-param-reassign
									entry.isVisible = inView
								}

								elements.get(entry.target)?.forEach(callback => {
									callback(inView, entry)
								})
							},
						)
					},
					options,
				)

			thresholds =
				observer.thresholds ||
				(Array.isArray(options.threshold) ?
					options.threshold :
					[options.threshold || 0]
				)

			instance = {
				id,
				observer,
				elements,
			}

			observerMap.set(id, instance)
		}

		return instance
	}

const observe = (
	element: Element,
	callback: ObserverInstanceCallback,
	options: IntersectionObserverInit = {},
	fallbackInView = unsupportedValue,
) => {
	if (
		typeof window.IntersectionObserver === "undefined" &&
		fallbackInView !== undefined
	) {
		const bounds = element.getBoundingClientRect()
		callback(fallbackInView, {
			isIntersecting: fallbackInView,
			target: element,
			intersectionRatio:
				typeof options.threshold === "number" ? options.threshold : 0,
			time: 0,
			boundingClientRect: bounds,
			intersectionRect: bounds,
			rootBounds: bounds,
		})
		return () => {}
	}

	const { id, observer, elements } =
		createObserver(options)

	const callbacks = elements.get(element) || []

	if (!elements.has(element)) {
		elements.set(element, callbacks)
	}

	callbacks.push(callback)
	observer.observe(element)

	return () => {
		callbacks.splice(callbacks.indexOf(callback), 1)

		if (callbacks.length === 0) {
			elements.delete(element)
			observer.unobserve(element)
		}

		if (elements.size === 0) {
			observer.disconnect()
			observerMap.delete(id)
		}
	}
}

export default observe