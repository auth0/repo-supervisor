import { Promise } from 'bluebird';
import url from 'url';
import config from './../../../config/main.json';
import trigger from './../../triggers/slack';
import webhook from './../';

const SUCCESS_RESPONSE = 'OK';

module.exports = (ctx, req, github, viewer, res) => {
  const wtURL = url.format({
    protocol: req.headers['x-forwarded-proto'],
    host: req.headers.host,
    pathname: req.url
  });
  const r = {
    name: ctx.data.repository.name,
    owner: ctx.data.repository.owner.login,
    pullRequestId: ctx.data.pull_request.number,
    pullRequestSHA: ctx.data.pull_request.head.sha
  };
  const updateCIStatus = config.pullRequests.updateGithubStatus;

  // Webhook trigger.
  const status = require('./../../helpers/status')(github, {
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
    const reportURL = viewer.getReportURL(wtURL, r.pullRequestId, r.owner, r.name);

    if (data.issues.length > 0) {
      if (config.runTriggers) {
        trigger(`${r.owner}/${r.name}`, reportURL);
      }

      if (updateCIStatus) {
        return status.setError(config.statusMessages.error, reportURL).finally(() =>
          res(SUCCESS_RESPONSE)
        );
      }
    }

    return status.setSuccess(config.statusMessages.success, reportURL).finally(() =>
      res(SUCCESS_RESPONSE)
    );
  })
  .catch((err) => {
    if (updateCIStatus) {
      status.setFailure(err.toString()).finally(() => res(err.stack));
    } else {
      res(err.stack);
    }
  });
};
