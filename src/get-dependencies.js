/**
 * Get a list of dependency nodes
 * @param {object} dependencies Map of dependencies and ranges
 * @param {function} callback Function called for each dependency
 */
async function getDependencies(dependencies, callback) {
  const nodes = [];
  for (const [id, range] of Object.entries(dependencies)) {
    const node = await callback(id, range);
    if (node) {
      nodes.push(node);
    }
  }
  return nodes;
}

module.exports = exports = getDependencies;
