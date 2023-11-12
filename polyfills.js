export function withResolvers() {
	if (!this) throw new TypeError("Promise.withResolvers called on non-object")
	const out = {
		*[Symbol.iterator](){
     			yield this.promise;
     			yield this.resolve;
     			yield this.reject;
  		}
	}
	out.promise = new this((resolve_, reject_) => {
		out.resolve = resolve_
		out.reject = reject_
	})
	return out
}
