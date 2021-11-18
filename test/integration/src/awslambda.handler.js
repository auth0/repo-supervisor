/* eslint-disable object-shorthand */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
const lambdaModule = './../../../dist/index.light';
const handler = require(lambdaModule).handler;
const config = require('./../../../config/main.json');
const http = require('./../../../src/helpers/http');
const fixtures = require('./../../fixtures/integration/awslambda');
/**
 * noPreserveCache() allows to reload a required module,
 * it's necessary for setting ENV variables which are allocated when
 * module is loaded and would not change after a value assignment.
 */
const proxyquire = require('proxyquire').noPreserveCache();

const jwtReportId = fixtures.JWT;
const responses = {
  actionNotAllowed: {
    statusCode: http.STATUS_CODE.ERROR,
    body: config.responseMessages.actionNotAllowed,
    headers: http.HEADER.CONTENT_TYPE_TEXT
  }
};

describe('Scenario: Run tool in AWS Lambda mode (Pull Request processing)', () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'foobar';
    process.env.JWT_SECRET = 'foobar';
  });

  describe('Lambda handler', () => {
    it('should error on missing ENV variable (GITHUB_TOKEN)', (cb) => {
      delete process.env.GITHUB_TOKEN;

      const event = {};
      const context = {};

      handler(event, context, (err, data) => {
        assert.isNull(err);
        expect(data).to.eql({
          statusCode: http.STATUS_CODE.ERROR,
          body: config.responseMessages.githubTokenNotProvided,
          headers: http.HEADER.CONTENT_TYPE_TEXT
        });

        cb();
      });
    });

    it('should error on missing ENV variable (JWT_SECRET)', (cb) => {
      delete process.env.JWT_SECRET;

      const event = {};
      const context = {};
      const handlerModule = proxyquire(lambdaModule, {}).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        expect(data).to.eql({
          statusCode: http.STATUS_CODE.ERROR,
          body: config.responseMessages.jwtTokenNotProvided,
          headers: http.HEADER.CONTENT_TYPE_TEXT
        });

        cb();
      });
    });

    it('should error on missing Event object from API Gateway', (cb) => {
      const event = undefined;
      const context = {};
      const handlerModule = proxyquire(lambdaModule, {}).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        expect(data).to.eql({
          statusCode: http.STATUS_CODE.ERROR,
          body: config.responseMessages.lambdaEventObjectNotFound,
          headers: http.HEADER.CONTENT_TYPE_TEXT
        });

        cb();
      });
    });

    it('should process a payload body that is a string', (cb) => {
      const event = {
        body: JSON.stringify({ action: 'foobar' })
      };
      const context = {};
      const handlerModule = proxyquire(lambdaModule, {}).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        expect(data).to.eql(responses.actionNotAllowed);

        cb();
      });
    });

    it('should process a payload body that is an object', (cb) => {
      const event = {
        body: { action: 'foobar' }
      };
      const context = {};
      const handlerModule = proxyquire(lambdaModule, {}).handler;

      handlerModule(event, context, (err, data) => {
        expect(data).to.eql(responses.actionNotAllowed);

        cb();
      });
    });

    it('should error on invalid JSON input for a payload body', (cb) => {
      const event = {
        body: 'invalid <JSON>'
      };
      const context = {};
      const handlerModule = proxyquire(lambdaModule, {}).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        expect(data).to.eql({
          statusCode: http.STATUS_CODE.ERROR,
          body: config.responseMessages.invalidPayloadFormat,
          headers: http.HEADER.CONTENT_TYPE_TEXT
        });

        cb();
      });
    });
  });

  describe('Reporting a false positive', () => {
    it('should error on invalid report id', (cb) => {
      const event = {
        queryStringParameters: {
          id: 'invalid_REPORT_id'
        }
      };
      const context = {};
      const handlerModule = proxyquire(lambdaModule, {}).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        expect(data).to.eql({
          statusCode: http.STATUS_CODE.ERROR,
          body: config.responseMessages.invalidReportID,
          headers: http.HEADER.CONTENT_TYPE_TEXT
        });

        cb();
      });
    });

    it('should respond with a success message if there are no errors', (cb) => {
      const event = {
        queryStringParameters: {
          false_positive: 1,
          id: jwtReportId
        }
      };
      const context = {};
      // Mock github service
      const handlerModule = proxyquire(lambdaModule, {
        '@octokit/rest': {
          Octokit: function Octokit() {
            return {
              pulls: { listFiles: () => Promise.resolve({ data: [] }) },
              git: { getBlob: () => Promise.resolve({ data: {} }) },
              repos: { createStatus: () => Promise.resolve() }
            };
          }
        }
      }).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        expect(data).to.eql({
          statusCode: http.STATUS_CODE.SUCCESS,
          body: '{"success":true}',
          headers: http.HEADER.CONTENT_TYPE_JSON
        });

        cb();
      });
    });

    it('should respond with a failure message on errors', (cb) => {
      const event = {
        queryStringParameters: {
          false_positive: 1,
          id: 'invalid_REPORT_id'
        }
      };
      const context = {};
      // Mock github service
      const handlerModule = proxyquire(lambdaModule, {
        '@octokit/rest': {
          Octokit: function Octokit() {
            return {
              pulls: { listFiles: () => Promise.resolve({ data: [] }) },
              git: { getBlob: () => Promise.resolve({ data: {} }) },
              repos: { createStatus: () => Promise.resolve() }
            };
          }
        }
      }).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        expect(data).to.eql({
          statusCode: http.STATUS_CODE.ERROR,
          body: '{"success":false}',
          headers: http.HEADER.CONTENT_TYPE_JSON
        });

        cb();
      });
    });
  });

  describe('View report', () => {
    it('should return a report without any findings', (cb) => {
      const event = {
        queryStringParameters: {
          id: jwtReportId
        }
      };
      const context = {};
      // Mock github service
      const handlerModule = proxyquire(lambdaModule, {
        '@octokit/rest': {
          Octokit: function Octokit() {
            return {
              pulls: { listFiles: () => Promise.resolve({ data: [] }) },
              git: { getBlob: () => Promise.resolve({ data: {} }) },
              repos: { createStatus: () => Promise.resolve() }
            };
          }
        }
      }).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        assert.isObject(data);

        expect(data.statusCode).to.eql(http.STATUS_CODE.SUCCESS);
        expect(data.headers).to.eql(http.HEADER.CONTENT_TYPE_HTML);

        assert.match(data.body, /Our tests were successful and no issues were found/);

        cb();
      });
    });

    it('should return a report with findings', (cb) => {
      const event = {
        queryStringParameters: {
          id: jwtReportId
        }
      };
      const context = {};
      // Mock github service
      const handlerModule = proxyquire(lambdaModule, {
        '@octokit/rest': {
          Octokit: function Octokit() {
            return {
              pulls: { listFiles: () => Promise.resolve({ data: fixtures.PR.withFindings.listFiles }) },
              git: { getBlob: () => Promise.resolve({ data: {
                content: Buffer.from(fixtures.PR.withFindings.getBlob).toString('base64')
              } }) },
              repos: { createStatus: () => Promise.resolve() }
            };
          }
        }
      }).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        assert.isObject(data);

        expect(data.statusCode).to.eql(http.STATUS_CODE.SUCCESS);
        expect(data.headers).to.eql(http.HEADER.CONTENT_TYPE_HTML);

        assert.match(data.body, /The entropy level for strings is too high/);
        assert.match(data.body, /<code>th1s1S4S[*]+<\/code>/);
        cb();
      });
    });
  });

  describe('Processing a PR', () => {
    it('should fail on PR action not supported in the config file', (cb) => {
      const event = {
        body: JSON.stringify({ action: 'not_supported_action' })
      };
      const context = {};
      const handlerModule = proxyquire(lambdaModule, {}).handler;

      handlerModule(event, context, (err, data) => {
        assert.isNull(err);
        expect(data).to.eql(responses.actionNotAllowed);

        cb();
      });
    });

    it('should succeed on PR with allowed action', (cb) => {
      // Mock github service
      const handlerModule = proxyquire(lambdaModule, {
        '@octokit/rest': {
          Octokit: function Octokit() {
            return {
              pulls: { listFiles: () => Promise.resolve({ data: [] }) },
              git: { getBlob: () => Promise.resolve({ data: {} }) },
              repos: { createStatus: () => Promise.resolve() }
            };
          }
        }
      }).handler;
      const actions = config.pullRequests.allowedActions;
      const context = {};
      const promises = [];

      actions.forEach((action) => {
        promises.push(new Promise((resolve, reject) => {
          const pr = {
            action,
            pull_request: {
              number: 1,
              head: { sha: '40bd001563085fc35165329ea1ff5c5ecbdbbeef' }
            },
            repository: {
              name: 'foobar',
              owner: { login: 'john' }
            }
          };
          const event = { body: JSON.stringify(pr) };
          const callback = (err, data) => {
            if (err) reject(err);
            resolve(data);
          };

          handlerModule(event, context, callback);
        }));
      });

      Promise.all(promises).then((values) => {
        assert.isArray(values);
        values.forEach((res) => {
          expect(res).to.eql({
            statusCode: http.STATUS_CODE.SUCCESS,
            body: 'OK',
            headers: http.HEADER.CONTENT_TYPE_TEXT
          });
        });

        cb();
      }).catch(cb);
    });
  });
});
