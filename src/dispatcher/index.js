import { Promise } from 'bluebird';
import url from './../helpers/url';
import config from './../../config/main.json';
import trigger from './../triggers/slack';
import webhook from './../webhook';

const SUCCESS_RESPONSE = 'OK';

module.exports = (ctx, req, github, viewer, res) => {
  const wtURL = url.getWebtaskURL(req);
  const r = {
    name: ctx.data.repository.name,
    owner: ctx.data.repository.owner.login,
    pullRequestId: ctx.data.pull_request.number,
    pullRequestSHA: ctx.data.pull_request.head.sha
  };
  const updateCIStatus = config.pullRequests.updateGithubStatus;
  const status = require('./../helpers/status')(github, {
    repo: r.name,
    user: r.owner,
    sha: r.pullRequestSHA
  });

  return Promise.resolve().then(() => {
    if (updateCIStatus) {
      return status.setPending(config.statusMessages.pending);
    }

    return Promise.resolve();
  })
  .then(() => webhook.parse(github, r.pullRequestId, r.owner, r.name, true))
  .then((data) => {
    const reportURL = viewer.getReportURL(
      wtURL, r.pullRequestId, r.pullRequestSHA, r.owner, r.name
    );

    if (data.issues.length > 0) {
      if (config.runTriggers) {
        // TODO check if status did change
        const prUrl = url.getPullRequestURL(`${r.owner}/${r.name}`, r.pullRequestId);
        trigger(`:warning: Secrets detected in: ${prUrl}`);
      }

      if (updateCIStatus) {
        return status.setError(config.statusMessages.error, reportURL).then(() =>
          res(SUCCESS_RESPONSE)
        );
      }
    }

    return status.setSuccess(config.statusMessages.success, reportURL).then(() =>
      res(SUCCESS_RESPONSE)
    );
  })
  .catch((err) => {
    const httpCode = Number.isSafeInteger(err.status) ? err.status : 400;
    const message = (httpCode === 404) ? 'Invalid permissions for the Github token' : err.toString();

    if (updateCIStatus) {
      status.setFailure(message).then(() => res(err.stack, httpCode));
    } else {
      res(err.stack, httpCode);
    }
  });
};
