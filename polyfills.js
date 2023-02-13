const Promise = (async () => {})().constructor

export function defer_unsubclassable() {
	if (this !== Promise)
		throw new TypeError("defer cannot be invoked if caller is not Promise")
	return defer_bound()
}

export function defer_bound() {
	return defer_subclassable.call(Promise)
}

export function defer_subclassable() {
	let resolve, reject
	const promise = new this((resolve_, reject_) => {
		resolve = resolve_
		reject = reject_
	})
	return { resolve, reject, promise }
}
