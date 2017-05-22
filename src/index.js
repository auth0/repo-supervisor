/* eslint consistent-return: off */
import assert from 'assert';
import config from './../config/main.json';
import github from './lib/github';
import viewer from './viewer';
import dispatcher from './dispatcher';
import token from './helpers/jwt';
import trigger from './triggers/slack';
import url from './helpers/url';

module.exports = (ctx, req, res) => {
  assert(ctx.data, 'Invalid request - missing query parameters.');
  assert(ctx.secrets, 'Secrets not set.');
  assert(ctx.secrets.GITHUB_TOKEN, 'GITHUB_TOKEN is not set.');
  assert(ctx.secrets.JWT_SECRET, 'JWT_SECRET is not set.');

  const respond = data => res.end(typeof data !== 'string' ? '' : data);
  const service = github(ctx.secrets.GITHUB_TOKEN);
  const view = viewer(ctx.secrets.JWT_SECRET, service);

  if (typeof ctx.data.ack_report !== 'undefined' && config.runTriggers) {
    const data = token.decode(ctx.data.id, ctx.secrets.JWT_SECRET);
    const prUrl = url.getPullRequestURLFromJWT(data);

    if (ctx.data.ack_report === '1') {
      trigger(`:white_check_mark: Report acknowledged: ${prUrl}`);

      const status = require('./helpers/status')(service, {
        repo: data.repo,
        user: data.owner,
        sha: data.pullRequestSHA
      });

      // Make PR green again if report was rejected.
      return status.setSuccess(
        `[rejected] ${config.statusMessages.success}`, url.getWebtaskURL(req)
      ).finally(() =>
        respond(JSON.stringify({
          success: true
        }))
      );
    }

    trigger(`:-1: Report rejected: ${prUrl}`);

    return respond(JSON.stringify({
      success: true
    }));
  }

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
