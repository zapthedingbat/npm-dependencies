# NPM Dependencies

Recursively lists all dependencies of a given NPM package.

## Optimisations

- NodeJS dosn't nativly cache DNS or respect TTLs, so every single HTTP request
  initiates a new DNS lookup. To get a performance lift and avoid hammering the
  local DNS resolver it might be good to cache DNS in-process given that we're
  always going to the same host. This package might be a good option -
  https://www.npmjs.com/package/lookup-dns-cache
