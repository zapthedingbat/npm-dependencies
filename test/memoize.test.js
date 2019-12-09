const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("memoize", function() {
  let sandbox;
  let memoize;

  before(function() {
    sandbox = sinon.createSandbox();
    memoize = proxyquire("../src/memoize", {});
  });

  afterEach(function() {
    sandbox.reset();
  });

  it("should return a function", function() {
    const testCache = new Map();
    const memoized = memoize(() => {}, testCache);

    expect(memoized).to.be.a("function");
  });

  it("should return a function that calls the given function with the url", async function() {
    const testCache = new Map();
    const spyDownloadFn = sandbox.spy();
    const testUrl = "test url";
    const memoized = memoize(spyDownloadFn, testCache);

    await memoized(testUrl);

    sandbox.assert.calledWith(spyDownloadFn, testUrl);
  });

  it("should return a function that only calls the given function once for the same url", async function() {
    const testCache = new Map();
    const spyDownloadFn = sandbox.spy();
    const testUrl = "test url";
    const memoized = memoize(spyDownloadFn, testCache);

    await memoized(testUrl);
    await memoized(testUrl);
    await memoized(testUrl);

    sandbox.assert.calledOnce(spyDownloadFn);
  });
});
