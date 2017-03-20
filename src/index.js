/* eslint consistent-return: off */
import assert from 'assert';
import config from './../config/main.json';
import github from './lib/github';
import viewer from './viewer';
import dispatcher from './webhook/dispatcher';

module.exports = (ctx, req, res) => {
  assert(ctx.data, 'Invalid request - missing query parameters.');
  assert(ctx.secrets, 'Secrets not set.');
  assert(ctx.secrets.GITHUB_TOKEN, 'GITHUB_TOKEN is not set.');
  assert(ctx.secrets.JWT_SECRET, 'JWT_SECRET is not set.');

  const respond = data => res.end(typeof data !== 'string' ? '' : data);
  const service = github(ctx.secrets.GITHUB_TOKEN);
  const view = viewer(ctx.secrets.JWT_SECRET, service);

  if (ctx.data.id) {
    // Viewer request.
    return view.getReportContent(ctx.data.id)
      .then(respond)
      .catch((err) => {
        console.error(err);
        respond('Could not process report URL.');
      });
  }

  if (config.pullRequests.allowedActions.indexOf(ctx.data.action) > -1) {
    return dispatcher(ctx, req, service, view, respond);
  }

  return respond('Payload not processed, invalid type.');
};
