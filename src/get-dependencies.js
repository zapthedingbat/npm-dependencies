/**
 * Get a list of dependency nodes
 * @param {object} dependencies Map of dependencies and ranges
 * @param {string[]} stack Array of parent dependencies
 * @param {function} callback Function called for each dependency
 */
async function getDependencies(dependencies, stack, callback) {
  const nodes = [];
  await Promise.all(
    Object.entries(dependencies).map(async ([id, range]) => {
      const node = await callback(id, range, stack);
      if (node) {
        nodes.push(node);
      }
    })
  );
  return nodes;
}

module.exports = exports = getDependencies;
