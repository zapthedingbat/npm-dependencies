const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("create tree fetcher", function() {
  let sandbox;
  let mockDownloadPackage;
  let mockGetDependencies;
  let createFetchTree;

  before(function() {
    sandbox = sinon.createSandbox();
    mockDownloadPackage = sandbox.stub();
    mockGetDependencies = sandbox.stub();
    createFetchTree = proxyquire("../src/fetch-tree", {
      "../src/download-package": mockDownloadPackage,
      "../src/get-dependencies": mockGetDependencies
    });
  });

  afterEach(function() {
    sandbox.reset();
  });

  it("should return a function", function() {
    const fetchTree = createFetchTree(() => {});

    expect(fetchTree).to.be.a("function");
  });

  describe("fetch tree", function() {
    let mockDownload;
    let fetchTree;

    beforeEach(function() {
      mockDownload = sandbox.stub();
      fetchTree = createFetchTree(mockDownload);
    });

    it("should download the package manifest", async function() {
      const testPackageId = "testPackageId";
      const testRange = "test range";

      await fetchTree(testPackageId, testRange);

      sandbox.assert.calledWith(
        mockDownloadPackage,
        testPackageId,
        testRange,
        mockDownload
      );
    });

    it("should return undefined if no matching package is available", async function() {
      const testPackageId = "testPackageId";
      const testRange = "test range";

      const tree = await fetchTree(testPackageId, testRange);

      expect(tree).to.be.undefined;
    });

    it("should find the details of a package", async function() {
      const testPackageId = "testPackageId";
      const testVersion = "test version";
      mockDownloadPackage.returns({ version: testVersion });

      const tree = await fetchTree(testPackageId, "test range");

      expect(tree).to.eql({
        id: testPackageId,
        version: testVersion,
        dependencies: []
      });
    });

    it("should find dependencies for each package recursivly", async function() {
      const testDependencies = {};
      mockDownloadPackage.returns({
        version: "testVersion",
        dependencies: testDependencies
      });
      mockGetDependencies
        .resolves()
        .onCall(0)
        .callsFake(async (_dependencies, callback) => {
          callback("dependencyId1", "dependencyRange1", []);
        })
        .onCall(1)
        .callsFake(async (_dependencies, callback) => {
          callback("dependencyId2", "dependencyRange2", []);
        });

      await fetchTree("testPackage", "1.0.0");

      sandbox.assert.calledWith(
        mockGetDependencies,
        testDependencies,
        sinon.match.func
      );
      sandbox.assert.calledWith(
        mockDownloadPackage,
        "dependencyId1",
        "dependencyRange1"
      );
      sandbox.assert.calledWith(
        mockDownloadPackage,
        "dependencyId2",
        "dependencyRange2"
      );
    });
  });
});
