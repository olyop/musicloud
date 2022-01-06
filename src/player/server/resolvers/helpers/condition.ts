type CF<TV, FV> =
	(i: TV | FV) => i is TV

type BF<V, T> =
	(input: V) => T

export const condition =
	<TI, FI>(cf: CF<TI, FI>) =>
		<T, F>(tf: BF<TI, T>, ff: BF<FI, F>) =>
			(i: TI | FI) => (
				cf(i) ? tf(i) : ff(i)
			)