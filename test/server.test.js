const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("server", function() {
  let sandbox;
  let mockDownload;
  let mockCreateFetchTree;
  let mockFetchTree;
  let act;

  before(function() {
    sandbox = sinon.createSandbox();
    mockHttp = {
      createServer: sandbox.stub(),
      listen: sandbox.stub()
    };
    mockDownload = sandbox.stub();
    mockCreateFetchTree = sandbox.stub();
    mockFetchTree = sandbox.stub();
    act = () => {
      proxyquire("../src/server", {
        http: mockHttp,
        "../src/download": mockDownload,
        "../src/fetch-tree": mockCreateFetchTree
      });
    };
  });

  beforeEach(function() {
    mockCreateFetchTree.returns(mockFetchTree);
    mockFetchTree.resolves({});
    mockHttp.createServer.returnsThis();
  });

  afterEach(function() {
    sandbox.reset();
  });

  it("should create a treeFetcher with the download function", function() {
    act();

    sandbox.assert.calledWith(mockCreateFetchTree, mockDownload);
  });

  describe("on request", function() {
    let handler;
    let testResponse;

    beforeEach(function() {
      testResponse = {
        writeHead: sandbox.stub(),
        end: sandbox.stub()
      };

      act();

      handler = mockHttp.createServer.getCall(0).args[0];
    });

    it("should call the tree fetcher with parameters from the URL", async function() {
      const testRequest = { url: "testurl/test package/test range" };

      await handler(testRequest, testResponse);

      sandbox.assert.calledWith(mockFetchTree, "test package", "test range");
    });

    it("should write the tree as JSON to the response", async function() {
      const testRequest = { url: "testurl/test package/test range" };
      const testTree = { test: 1 };
      const testTreeJson = JSON.stringify(testTree, null, 2);
      mockFetchTree.resolves(testTree);

      await handler(testRequest, testResponse);

      sandbox.assert.calledWith(testResponse.writeHead, 200, {
        "Content-Type": "application/json"
      });
      sandbox.assert.calledWith(testResponse.end, testTreeJson);
    });
  });
});
