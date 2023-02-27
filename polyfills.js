const Promise = (async () => {})().constructor

export function withResolvers_bound() {
	return withResolvers_subclassable.call(Promise)
}

export function withResolvers_subclassable() {
	const out = {}
	out.promise = new this((resolve_, reject_) => {
		out.resolve = resolve_
		out.reject = reject_
	})
	return out
}
