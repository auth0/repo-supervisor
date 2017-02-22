import url from 'url';
import config from './../../../config/main.json';
import webhook from './../';

module.exports = (ctx, req, github, viewer, res) => {
  const wtURL = url.format({
    protocol: req.headers['x-forwarded-proto'],
    host: req.headers.host,
    pathname: req.url
  });
  const repository = {
    name: ctx.data.repository.name,
    owner: ctx.data.repository.owner.login,
    pullRequestId: ctx.data.pull_request.number,
    pullRequestSHA: ctx.data.pull_request.head.sha
  };

  // Webhook trigger.
  const status = require('./../../helpers/status')(github, {
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
        wtURL, repository.pullRequestId, repository.owner, repository.name
      );

      if (data.issues.length > 0) return status.setError(config.statusMessages.error, reportURL);

      return status.setSuccess(config.statusMessages.success, reportURL);
    }).then(res)
      .catch(err => status.setFailure(err.toString()).then(res))
  ).catch(err => res(err.toString()));
};
