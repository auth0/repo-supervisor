const url = require('./../helpers/url');
const config = require('./../../config/main.json');
const trigger = require('./../triggers/slack');
const webhook = require('./../webhook');
const util = require('util');
const http = require('./../helpers/http');

const SUCCESS_MESSAGE = 'OK';

module.exports = async (payload, event, github, viewer, res, isFalsePositiveReport) => {
  const endpointURL = url.getEndpointURL(event);
  const r = {
    name: payload.repository.name,
    owner: payload.repository.owner.login,
    pullRequestId: payload.pull_request.number,
    pullRequestSHA: payload.pull_request.head.sha
  };
  const fullRepoName = `${r.owner}/${r.name}`;
  const updateCIStatus = config.pullRequests.updateGithubStatus;
  const reportURL = viewer.getReportURL(endpointURL, r.pullRequestId, r.pullRequestSHA, r.owner, r.name);
  // const pullRequestURL = url.getPullRequestURL(r.owner, r.name, r.pullRequestId);
  const status = require('./../helpers/status')(github, {
    repo: r.name,
    user: r.owner,
    sha: r.pullRequestSHA
  });

  try {
    if (updateCIStatus) {
      await status.setPending(config.statusMessages.pending);
    }

    if (isFalsePositiveReport) {
      if (config.runTriggers) {
        await trigger(
          util.format(config.triggerMessages.falsePositiveReported, fullRepoName, url.getShortSlackURL(reportURL))
        );
      }

      if (updateCIStatus) {
        await status.setSuccess(config.statusMessages.falsePositive, reportURL);
      }

      return Promise.resolve(res(SUCCESS_MESSAGE));
    }

    const webhookData = await webhook.parse(github, r.pullRequestId, r.owner, r.name, true);

    if (webhookData.issues.length > 0) {
      if (config.runTriggers) {
        await trigger(
          util.format(config.triggerMessages.newIssuesDetected, fullRepoName, url.getShortSlackURL(reportURL))
        );
      }

      if (updateCIStatus) {
        await status.setError(config.statusMessages.error, reportURL).then(() => res(SUCCESS_MESSAGE));
      }

      return Promise.resolve(res(SUCCESS_MESSAGE));
    }

    if (updateCIStatus) {
      await status.setSuccess(config.statusMessages.success, reportURL).then(() => res(SUCCESS_MESSAGE));
    }

    return Promise.resolve(res(SUCCESS_MESSAGE));
  } catch (e) {
    const httpCode = Number.isSafeInteger(e.status) ? e.status : http.STATUS_CODE.ERROR;
    if (httpCode === 401) return res(e.message, httpCode);

    if (updateCIStatus) {
      status.setFailure(e.message);
    }

    return res(e.message, httpCode);
  }
};
