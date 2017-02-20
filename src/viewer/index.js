const config = require('../../config/viewer.json');
const Promise = require('bluebird').Promise;
const token = require('./helpers/jwt.js');

module.exports = (secret, service) => ({
  getReportContent: (id) => {
    const data = token.decode(id, secret);

    if (data !== null) {
      // TODO check cache entries.
      const wh = require('../parser/webhook');

      return wh.parse(
        service,
        data.pullRequestId,
        data.owner,
        data.repo
      );
    }

    return Promise.resolve(null);
  },
  getReportURL: (pullRequestId, owner, repo) => {
    const id = token.create({ pullRequestId, owner, repo }, secret);
    const url = config.url;

    return `${url}/?id=${id}`;
  }
});
