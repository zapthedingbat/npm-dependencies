const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("download package", function() {
  let sandbox;
  let mockSemver;
  let mockSelectPackage;
  let downloadPackage;

  before(function() {
    sandbox = sinon.createSandbox();
    mockSelectPackage = sandbox.stub();
    mockSemver = {
      validRange: sandbox.stub()
    };
    downloadPackage = proxyquire("../src/download-package", {
      semver: mockSemver,
      "../src/select-package": mockSelectPackage
    });
  });

  beforeEach(function() {
    mockSemver.validRange.returns(true);
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

  it("should validate the semver range", async function() {
    const testPackageId = "testPackageId";
    const testRange = "test range";
    const mockDownload = sandbox.stub();
    mockSemver.validRange.returns(false);

    const tree = await downloadPackage(testPackageId, testRange, mockDownload);

    expect(tree).to.be.null;
    sandbox.assert.calledWith(mockSemver.validRange, testRange, {
      loose: true
    });
  });
});
