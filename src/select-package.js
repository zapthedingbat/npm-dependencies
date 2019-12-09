const semver = require("semver");

/**
 * Returns the version of the package that satisfies the given semver range
 * @param {object} manifest Package manifest document from registry
 * @param {string} range Semver range
 */
function selectPackage(manifest, range) {
  if (!manifest || !manifest.versions) {
    return;
  }
  const versions = Object.keys(manifest.versions);
  const version = semver.minSatisfying(versions, range, { loose: true });
  return manifest.versions[version];
}

module.exports = exports = selectPackage;
