const downloadPackage = require("./download-package");
const getDependencies = require("./get-dependencies");

function createFetchTree(download) {
  async function fetchSubTree(id, range, stack) {
    const package = await downloadPackage(id, range, download);
    if (package) {
      const { version, dependencies } = package;

      const result = {
        id,
        version,
        dependencies: []
      };

      // Skip dependencies when there is a cyclical reference
      const key = `${id}@${version}`;
      if (stack.includes(key)) {
        // Add property to the result to mark cyclical depencencies
        result.cycle = true;
      } else if (dependencies) {
        // Recusivly build dependency list
        result.dependencies = await getDependencies(
          dependencies,
          stack.concat(key),
          fetchSubTree
        );
      }
      return result;
    }
  }

  return function fetchTree(id, range) {
    return fetchSubTree(id, range, []);
  };
}

module.exports = exports = createFetchTree;
