'use strict';

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
    status.setPending('Checking for security issues...').then(() => {
      if (data.issues.length > 0) {
        return status.setError(
          'Security issues were detected.',
          viewer.getReportURL(repository.pullRequestId, repository.owner, repository.name)
        );
      }

      return status.setSuccess('Everything looks fine, no issues detected.');
    }).then(res)
      .catch(err => status.setFailure(err.toString()).then(res))
  ).catch(err => res(err.toString()));
};
