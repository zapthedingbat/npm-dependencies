#!/usr/bin/env node
const download = require("./download");
const createFetchTree = require("./fetch-tree");

(async function run() {
  const [, , package, range] = process.argv;

  const treeFetcher = createFetchTree(download);

  const tree = await treeFetcher(package, range);

  process.stdout.write(JSON.stringify(tree, null, 2));
})();
