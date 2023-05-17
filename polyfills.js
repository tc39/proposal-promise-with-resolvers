const Promise = (async () => {})().constructor

export function withResolvers_bound() {
	return withResolvers_subclassable.call(Promise)
}

export function withResolvers_subclassable() {
	if (!this) throw new TypeError("Promise.withResolvers called on non-object")
	const out = {}
	out.promise = new this((resolve_, reject_) => {
		out.resolve = resolve_
		out.reject = reject_
	})
	return out
}
