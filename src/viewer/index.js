'use strict';

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
  getReportURL: (url, pullRequestId, owner, repo) => {
    const id = token.create({ pullRequestId, owner, repo }, secret);
    return `${url}/?id=${id}`;
  }
});
