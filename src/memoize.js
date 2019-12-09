/**
 * Memoize the given download function using the cache provided.
 * @param {function} downloadFn Dowlnoad function taking a single URL parameter
 * @param {Map} cache cache implementing the javascript Map interface.
 */
function memoize(downloadFn, cache) {
  return async function memoized(url) {
    if (cache.has(url)) {
      return await cache.get(url);
    }
    const promise = downloadFn(url);
    cache.set(url, promise);
    return await promise;
  };
}

module.exports = exports = memoize;
