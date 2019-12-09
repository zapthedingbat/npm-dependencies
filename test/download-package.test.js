const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("download package", function() {
  let sandbox;
  let mockSelectPackage;
  let downloadPackage;

  before(function() {
    sandbox = sinon.createSandbox();
    mockSelectPackage = sandbox.stub();

    downloadPackage = proxyquire("../src/download-package", {
      "../src/select-package": mockSelectPackage
    });
  });

  afterEach(function() {
    sandbox.reset();
  });

  it("should download the package manifest", async function() {
    const testManifest = { versions: {} };
    const mockDownload = sandbox.stub().resolves(testManifest);

    await downloadPackage("testPackageId", "test range", mockDownload);

    sandbox.assert.calledWith(
      mockDownload,
      "https://registry.npmjs.org/testPackageId"
    );
  });

  it("should find the matching version in the manifest", async function() {
    const testManifest = { versions: {} };
    const testPackageId = "testPackageId";
    const testRange = "test range";
    const mockDownload = sandbox.stub().resolves(testManifest);

    await downloadPackage(testPackageId, testRange, mockDownload);

    sandbox.assert.calledWith(mockSelectPackage, testManifest, testRange);
  });

  it("should return the matching version", async function() {
    const testManifest = { versions: {} };
    const testPackage = {};
    mockSelectPackage.returns(testPackage);
    const mockDownload = sandbox.stub().resolves(testManifest);

    const tree = await downloadPackage(
      "testPackageId",
      "testRange",
      mockDownload
    );

    expect(tree).to.equal(testPackage);
  });
});
