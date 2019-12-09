const downloadPackage = require("./download-package");
const getDependencies = require("./get-dependencies");

function createFetchTree(download) {
  async function fetchSubTree(id, range) {
    const package = await downloadPackage(id, range, download);
    if (package) {
      const { version, dependencies } = package;

      const result = {
        id,
        version,
        dependencies: []
      };

      if (dependencies) {
        // Recusivly build dependency list
        result.dependencies = await getDependencies(dependencies, fetchSubTree);
      }
      return result;
    }
  }

  return function fetchTree(id, range) {
    return fetchSubTree(id, range, []);
  };
}

module.exports = exports = createFetchTree;
