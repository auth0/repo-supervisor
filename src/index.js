'use strict';

const assert = require('assert');
const config = require('../config/main.json');
const wh = require('./parser/webhook');

module.exports = (ctx, req, res) => {
  assert(ctx.data, 'Invalid request - missing query parameters.');
  assert(ctx.secrets, 'Secrets not set.');
  assert(ctx.secrets.GITHUB_TOKEN, 'GITHUB_TOKEN is not set.');
  assert(ctx.secrets.JWT_SECRET, 'JWT_SECRET is not set.');

  const respond = data => res.end(data || '');
  const github = require('./lib/github')(ctx.secrets.GITHUB_TOKEN);
  const viewer = require('./viewer')(ctx.secrets.JWT_SECRET, github);

  if (ctx.data.id) {
    // Viewer request.
    return viewer.getReportContent(ctx.data.id).then(respond).catch(respond);
  }

  if (config.pullRequests.allowedActions.indexOf(ctx.data.action) > -1) {
    // Webhook trigger.
    return wh.parse(
      github,
      ctx.data.number,
      ctx.data.repository.owner.login,
      ctx.data.repository.name
    ).then(respond).catch(respond);
  }

  // Other kind of request, skip.
  return respond();
};
