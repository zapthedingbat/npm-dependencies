#!/usr/bin/env node
const http = require("http");
const download = require("./download");
const createFetchTree = require("./fetch-tree");
const memoize = require("./memoize");

const cache = new Map();
const memoizedDownload = memoize(download, cache);
const fetchTree = createFetchTree(memoizedDownload);

http
  .createServer(async (req, res) => {
    const [, package, range] = req.url.split("/");
    const tree = await fetchTree(package, range);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tree, null, 2));
  })
  .listen(3000);
