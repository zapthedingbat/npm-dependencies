const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("cli", function() {
  let sandbox;
  let mockDownload;
  let mockCreateFetchTree;
  let mockFetchTree;
  let writeStub;
  let act;

  before(function() {
    sandbox = sinon.createSandbox();
    mockDownload = sandbox.stub();
    mockCreateFetchTree = sandbox.stub();
    mockFetchTree = sandbox.stub();
    act = () => {
      proxyquire("../src/cli", {
        "../src/download": mockDownload,
        "../src/fetch-tree": mockCreateFetchTree
      });
    };
  });

  beforeEach(function() {
    mockCreateFetchTree.returns(mockFetchTree);
    mockFetchTree.resolves({});
    writeStub = sandbox.stub(process.stdout, "write");
    writeStub.withArgs("{}").returns();
    writeStub.callThrough();
  });

  afterEach(function() {
    writeStub.restore();
    sandbox.reset();
  });

  it("should create a treeFetcher with the download function", function() {
    act();

    sandbox.assert.calledWith(mockCreateFetchTree, mockDownload);
  });

  it("should call the tree fetcher with the given arguments", function() {
    const testArgv = ["bin", "script", "test package", "test range"];
    sandbox.stub(process, "argv").value(testArgv);

    act();

    sandbox.assert.calledWith(mockFetchTree, "test package", "test range");
  });

  it("should write the result to stdout as JSON", async function() {
    const testTree = { test: 1 };
    const testTreeJson = JSON.stringify(testTree, null, 2);
    mockFetchTree.resolves(testTree);

    await {
      then: done => {
        writeStub.callsFake(done);
        act();
      }
    };

    writeStub.restore();
    sandbox.assert.calledWith(writeStub, testTreeJson);
  });
});
