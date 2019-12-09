const fetch = require("node-fetch");

/**
 * Download the specified URL and return the result as a parsed JSON object
 * @param {string} url Url to download
 */
async function download(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

module.exports = exports = download;
