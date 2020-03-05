const token = require('./../helpers/jwt');
const webhook = require('./../webhook');
const http = require('./../helpers/http');
const config = require('./../../config/main.json');

module.exports = (secret, service) => ({
  getReportContent: async (id) => {
    const data = token.decode(id, secret);

    if (data !== null) {
      // TODO check cache entries.
      const report = await webhook.parse(
        service,
        data.pullRequestId,
        data.owner,
        data.repo
      );

      return Promise.resolve({
        body: report,
        headers: http.HEADER.CONTENT_TYPE_HTML
      });
    }

    return Promise.resolve(http.response(config.responseMessages.invalidReportID, http.STATUS_CODE.ERROR));
  },
  getReportURL: (url, pullRequestId, pullRequestSHA, owner, repo) => {
    const id = token.create({ pullRequestId, pullRequestSHA, owner, repo }, secret);
    return `${url}/?id=${id}`;
  }
});
