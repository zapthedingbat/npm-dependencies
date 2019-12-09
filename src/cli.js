#!/usr/bin/env node
const download = require("./download");
const createFetchTree = require("./fetch-tree");
const memoize = require("./memoize");

(async function run() {
  const [, , package, range] = process.argv;

  const cache = new Map();

  const memoizedDownload = memoize(download, cache);

  const treeFetcher = createFetchTree(memoizedDownload);

  const tree = await treeFetcher(package, range);

  process.stdout.write(JSON.stringify(tree, null, 2));
})();
