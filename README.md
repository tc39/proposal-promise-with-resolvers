# proposal-promise-defer

## Synopsis

When hand-rolling a Promise, the user must pass an executor callback which takes two arguments: a resolve function, which triggers resolution of the promise, and a reject function, which triggers rejection. This works well if the callback can embed a call to an asynchronous function which will eventually trigger the resolution or rejection, e.g., the registration of an event listener.

```js
const myPromise = new Promise((resolve, reject) => {
  asyncRequest(config, response => {
    const buffer = [];
    response.on("data", data => buffer.push(data));
    response.on("end", () => resolve(buffer));
    response.on("error", reason => reject(reason));
  })
})
```

Often however developers would like to configure the promise's resolution and rejection behavior after instantiating it. Today this requires a cumbersome workaround to extract the resolve and reject functions from the callback scope:

```js
let resolve;
let reject;
const myPromise = new Promise((resolve_, reject_) => {
  resolve = resolve_;
  reject = reject_;
})
```

This is boilerplate code that is very frequently re-written by developers. This proposal simply seeks to add a static method, tentatively called `defer`, to the `Promise` constructor which returns a promise along with its resolution and rejection functions conveniently exposed.

```js
const { promise, resolve, reject } = Promise.defer();
```

## Existing implementations

The Deno standard library exposes a slight variant of this function; its definition through v0.102.0 is provided below.

```ts
export function deferred<T>(): Deferred<T> {
  let methods;
  const promise = new Promise<T>((resolve, reject): void => {
    methods = { resolve, reject };
  });
  return Object.assign(promise, methods) as Deferred<T>;
}
```

The resolve and reject functions are attached as methods to the promise rather than being return alongside the promise. Since v0.103.0 of the Deno standard library there is also a readonly `state` property on the promise which has the possible values `"fulfilled"`, `"rejected"`, and `"pending"`.

## Choice points

Besides the possibility of adopting Deno's `deferred` interface, there is the question of how this method should behave in cases of subclassing. There are three options:

1. On subclasses of `Promise`, the `defer` method should produce instances of the subclass.
2. On subclasses of `Promise`, the `defer` method should produce plain Promises.

These questions would need to be resolved after reaching Stage 1. The current spec describes option 1.
