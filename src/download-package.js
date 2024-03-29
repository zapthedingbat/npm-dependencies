const semver = require("semver");
const selectPackage = require("./select-package");

/**
 * Download the package manifest and return the package satisfying the given semver range.
 * @param {string} id Identifier of the NPM package
 * @param {string} range SemVer format version range
 * @param {function} download Fetch function that downloads a given URL
 */
async function downloadPackage(id, range, download) {
  // Check that the range is valid semver
  if (!semver.validRange(range, { loose: true })) {
    return null;
  }

  const manifest = await download(`https://registry.npmjs.org/${id}`);
  const package = selectPackage(manifest, range);
  return package;
}

module.exports = exports = downloadPackage;
