const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("select package", function() {
  let sandbox;
  let mockSemver;
  let selectPackage;

  before(function() {
    sandbox = sinon.createSandbox();
    mockSemver = { minSatisfying: sandbox.stub() };
    selectPackage = proxyquire("../src/select-package", {
      semver: mockSemver
    });
  });

  afterEach(function() {
    sandbox.reset();
  });

  it("should return undefined if the manifest is falsy", async function() {
    const version = selectPackage(null, "test range");

    expect(version).to.be.undefined;
  });

  it("should return undefined if the manifest.versions is falsy", async function() {
    const version = selectPackage({}, "test range");

    expect(version).to.be.undefined;
  });

  it("should return the lowest available version satisfying the given range", async function() {
    const testVersions = { "1": {}, "2": {}, "3": {} };
    mockSemver.minSatisfying.returns("2");

    const version = selectPackage({ versions: testVersions }, "test range");

    expect(version).to.equal(testVersions["2"]);
  });
});
