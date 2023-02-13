const Promise = (async () => {})().constructor

export function defer_bound() {
	return defer_subclassable.call(Promise)
}

export function defer_subclassable() {
	const out = {}
	out.promise = new this((resolve_, reject_) => {
		out.resolve = resolve_
		out.reject = reject_
	})
	return out
}
