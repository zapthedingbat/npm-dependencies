module.exports = function(wallaby) {
  return {
    files: [{ pattern: "src/**/*.js" }],
    tests: ["test/**/*.test.js"],
    env: {
      type: "node"
    }
  };
};
