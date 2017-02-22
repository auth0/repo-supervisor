import { Promise } from 'bluebird';
import token from './helpers/jwt';
import webhook from './../webhook';

module.exports = (secret, service) => ({
  getReportContent: (id) => {
    const data = token.decode(id, secret);

    if (data !== null) {
      // TODO check cache entries.
      return webhook.parse(
        service,
        data.pullRequestId,
        data.owner,
        data.repo
      );
    }

    return Promise.resolve(null);
  },
  getReportURL: (url, pullRequestId, owner, repo) => {
    const id = token.create({ pullRequestId, owner, repo }, secret);
    return `${url}/?id=${id}`;
  }
});
