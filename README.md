# proposal-promise-with-resolvers

slides: https://docs.google.com/presentation/d/18CqQc6GfZJBWmT7li2nqfvrSFhpNwtQWPfSXhAwo-Bo/edit?usp=sharing

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

This is boilerplate code that is very frequently re-written by developers. This proposal simply seeks to add a static method, tentatively called `withResolvers`, to the `Promise` constructor which returns a promise along with its resolution and rejection functions conveniently exposed.

```js
const { promise, resolve, reject } = Promise.withResolvers();
```

## Existing implementations

Libraries and applications continually re-invent this wheel. Below are just a handful of examples.

|Library|Example|
|------------|----------|
|React|[inline example](https://github.com/facebook/react/blob/d9e0485c84b45055ba86629dc20870faca9b5973/packages/react-dom/src/__tests__/ReactDOMFizzStaticBrowser-test.js#L95)
|Vue | [inline example](https://github.com/vuejs/core/blob/9c304bfe7942a20264235865b4bb5f6e53fdee0d/packages/runtime-core/src/compat/componentAsync.ts#L32)
|Axios|[inline example](https://github.com/axios/axios/blob/bdf493cf8b84eb3e3440e72d5725ba0f138e0451/lib/cancel/CancelToken.js#L20)
|TypeScript|[utility](https://github.com/microsoft/TypeScript/blob/1d96eb489e559f4f61522edb3c8b5987bbe948af/src/harness/util.ts#L121)
|Vite|[inline example](https://github.com/vitejs/vite/blob/134ce6817984bad0f5fb043481502531fee9b1db/playground/test-utils.ts#L225)
|Deno stdlib | [utility](https://deno.land/std@0.178.0/async/deferred.ts?source)


## Choice points

There is the question of how this method should behave in cases of subclassing. There are two options:

1. On subclasses of `Promise`, the `withResolvers` method should produce instances of the subclass.
2. On subclasses of `Promise`, the `withResolvers` method should produce plain Promises.

These questions would need to be resolved after reaching Stage 1. The current spec describes option 1.
