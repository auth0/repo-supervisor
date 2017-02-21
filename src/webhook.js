'use strict';

const config = require('../config/main.json');
const webhook = require('./parser/webhook');

module.exports = (ctx, github, viewer, res) => {
  const repository = {
    name: ctx.data.repository.name,
    owner: ctx.data.repository.owner.login,
    pullRequestId: ctx.data.pull_request.number,
    pullRequestSHA: ctx.data.pull_request.head.sha
  };

  // Webhook trigger.
  const status = require('./helpers/status')(github, {
    repo: repository.name,
    user: repository.owner,
    sha: repository.pullRequestSHA
  });

  return webhook.parse(
    github,
    repository.pullRequestId,
    repository.owner,
    repository.name,
    true
  ).then(data =>
    status.setPending(config.statusMessages.pending).then(() => {
      const reportURL = viewer.getReportURL(
        repository.pullRequestId, repository.owner, repository.name
      );

      if (data.issues.length > 0) return status.setError(config.statusMessages.error, reportURL);

      return status.setSuccess(config.statusMessages.success, reportURL);
    }).then(res)
      .catch(err => status.setFailure(err.toString()).then(res))
  ).catch(err => res(err.toString()));
};
