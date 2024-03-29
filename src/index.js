/* eslint-disable max-len */
/* eslint consistent-return: off */
const config = require('./../config/main.json');
const github = require('./lib/github');
const viewer = require('./viewer');
const dispatcher = require('./dispatcher');
const http = require('./helpers/http');
const handler = require('./awslambda.handler');
const token = require('./helpers/jwt');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const DEBUG = process.env.DEBUG;

const returnErrorResponse = message => Promise.resolve(http.response(message, http.STATUS_CODE.ERROR));

async function lambda(event) {
  if (DEBUG) console.log(event);

  if (!GITHUB_TOKEN) { return returnErrorResponse(config.responseMessages.githubTokenNotProvided); }
  if (!JWT_SECRET) { return returnErrorResponse(config.responseMessages.jwtTokenNotProvided); }
  if (!event) { return returnErrorResponse(config.responseMessages.lambdaEventObjectNotFound); }

  let requestBody;
  let requestParams = {};

  /**
   * It seems like there are two types of Event object headers naming conventions.
   *
   * REST Private API: Camel-Case
   * REST Public API: lower-case
   */
  if (event.headers) {
    const normalizedHeaders = {};

    Object.keys(event.headers).forEach((id) => {
      normalizedHeaders[id.toLowerCase()] = event.headers[id];
    });

    event.headers = normalizedHeaders;
  }

  if (event.queryStringParameters) {
    requestParams = {
      isFalsePositiveReport: !!([1, '1', 'true', true].indexOf(event.queryStringParameters.false_positive) > -1),
      reportId: event.queryStringParameters.id
    };
  }

  if (event.body) {
    if (typeof event.body === 'string') {
      try {
        requestBody = JSON.parse(event.body);
      } catch (e) {
        return returnErrorResponse(config.responseMessages.invalidPayloadFormat);
      }
    } else {
      requestBody = event.body;
    }
  }

  const service = github(GITHUB_TOKEN);
  const view = viewer(JWT_SECRET, service);

  if (requestParams.isFalsePositiveReport && requestParams.reportId) {
    // Response to the ajax call in the html report
    const success = { success: true };
    const failure = { success: false };
    const resp = (isSuccess = true) => Promise.resolve(http.response(
      isSuccess ? success : failure,
      isSuccess ? http.STATUS_CODE.SUCCESS : http.STATUS_CODE.ERROR,
      http.HEADER.CONTENT_TYPE_JSON
    ));
    const jwt = token.decode(requestParams.reportId, JWT_SECRET);

    if (jwt === null) {
      return Promise.resolve(resp(false));
    }

    const payload = {
      repository: {
        name: jwt.repo,
        owner: {
          login: jwt.owner
        }
      },
      pull_request: {
        number: jwt.pullRequestId,
        head: { sha: jwt.pullRequestSHA }
      }
    };

    return dispatcher(payload, event, service, view, http.response, true)
      .then(resp)
      .catch(() => resp(false));
  }

  if (!requestParams.isFalsePositiveReport && requestParams.reportId) {
    return view.getReportContent(requestParams.reportId);
  }

  if (config.pullRequests.allowedActions.indexOf(requestBody.action) > -1) {
    if (WEBHOOK_SECRET && event.headers[service.HTTP_SIGNATURE_HEADER]) {
      const signature = event.headers[service.HTTP_SIGNATURE_HEADER];
      const isSigValid = await service.webhooks.verify(WEBHOOK_SECRET, event.body, signature);

      if (!isSigValid) return returnErrorResponse(config.responseMessages.invalidWebhookSecret);
    }

    return dispatcher(requestBody, event, service, view, http.response);
  }

  return returnErrorResponse(config.responseMessages.actionNotAllowed);
}

exports.handler = handler(lambda);
