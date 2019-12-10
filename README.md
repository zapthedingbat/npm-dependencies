# NPM Dependencies

Recursively lists all dependencies of a given NPM package.

## Usage

### CLI

Link the package with `npm link`

```
npm-dependencies <package> <semver range>
```

### Server

```
node src/server.js
```

You can then access the server on port 3000. E.g http://localhost:3000/react/16

## Architecture

Tha application is currently architected to query the npmjs.com package registry
about each package that it hasn't cached. We're interogating a master dataset
that's not optimised for our needs. While this works on a small scale, with
greater load it might make more sense to move to a CQRS approach where we
maintain a seperate materialized view of the dependency graph of packages; A
write-model that's easy to update and traverse (maybe a graph database) and a
read-model that's optimised for lookups (maybe a KV store).

We'd need to start by enumerating all packages in the registry onto an event
stream and then continuing to publish events from the
[Replication API](https://github.com/npm/registry/blob/master/docs/REPLICATE-API.md).
Applying each event to our write-model and then projecting this to our
read-model would give us an eventually-consistant architecture that would scale
horizontally.

## Optimisations

Even without a distributed, event-based architecture, there are things that
could be done to improve the application in it's current state.

- The application has an in-process cache (just a Map) to cache HTTP requests to
  the package registry. This should probably be moved out of process to a shared
  KV store to make it more resiliant and provice automatic cache eviction. Right
  now it will leak memory as the map glows in size.

- NodeJS dosn't nativly cache DNS or respect TTLs, so every single HTTP request
  initiates a new DNS lookup. To get a performance lift and avoid hammering the
  local DNS resolver it might be good to cache DNS in-process given that we're
  always going to the same host. This package might be a good option -
  https://www.npmjs.com/package/lookup-dns-cache

- The service only supports semver version ranges however NPM supports other
  references like git repositories. Support for this could be added by
  introducing additional logic when fetching package metadata.
