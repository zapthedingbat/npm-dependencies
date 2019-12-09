const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("get dependencies", function() {
  let getDependencies;

  before(function() {
    sandbox = sinon.createSandbox();
    getDependencies = proxyquire("../src/get-dependencies", {});
  });

  afterEach(function() {
    sandbox.reset();
  });

  it("should invoke the callback for each dependency and return the result as an array", async function() {
    const testDependencies = {
      testId1: "testRange1",
      testId2: "testRange2"
    };
    const testNode = {};
    const mockCallback = sinon.stub().resolves(testNode);

    const dependencies = await getDependencies(testDependencies, mockCallback);

    sandbox.assert.calledWith(mockCallback, "testId1", "testRange1");
    sandbox.assert.calledWith(mockCallback, "testId2", "testRange2");
    expect(dependencies).to.eql([testNode, testNode]);
  });
});
