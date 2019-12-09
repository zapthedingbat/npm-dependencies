const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("download", function() {
  let sandbox;
  let mockFetch;
  let mockResponse;
  let download;

  before(function() {
    sandbox = sinon.createSandbox();
    mockFetch = sandbox.stub();
    mockResponse = { json: sandbox.stub() };
    download = proxyquire("../src/download", {
      "node-fetch": mockFetch
    });
  });

  beforeEach(function() {});

  afterEach(function() {
    sandbox.restore();
  });

  it("should be a function", function() {
    expect(download).to.be.a("function");
  });

  it("should fetch the package manifest from the registry", async function() {
    mockFetch.resolves(mockResponse);

    await download("test url");

    sandbox.assert.calledWith(mockFetch, "test url");
  });

  it("should return the downloaded package the manifest", async function() {
    const testManifest = {};
    mockResponse.json.resolves(testManifest);
    mockFetch.resolves(mockResponse);

    const actual = await download("test url");

    expect(actual).to.eq(testManifest);
  });
});
