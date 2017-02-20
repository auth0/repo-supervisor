'use strict';

const assert = require('assert');
const path = require('path');

const config = require('../config/main.json');
const filtersList = require('../config/filters.json');

module.exports = (ctx, cb) => {
  assert(ctx.secrets, 'Secrets not set.');
  assert(ctx.secrets.GITHUB_TOKEN, 'GITHUB_TOKEN secret is not set.');

  if (!ctx.data || config.pullRequests.allowedActions.indexOf(ctx.data.action) === -1) {
    // Not a desired PR object, skip.
    return cb(null, 'Parameters not provided.');
  }

  const github = require('./lib/github')(ctx.secrets.GITHUB_TOKEN);
  const owner = ctx.data.repository.owner.login;
  const repo = ctx.data.repository.name;
  const prId = ctx.data.number;

  // Get list of files in a specific pull request
  github.pullRequests.getFiles({ owner, repo, number: prId })
  .then((resp) => {
    const exts = config.pullRequests.allowedExtensions;
    const files = resp.filter(file => !exts.indexOf(path.parse(file.filename).ext));

    return files;
  })
  .map(file => github.gitdata.getBlob({ owner, repo, sha: file.sha }).then(
    content => ({ blob: content, meta: file })
  ))
  .then((files) => {
    // Apply filters specific for file types
    const issues = [];

    files.forEach((file) => {
      // Remove sensitive and memory consuming elements.
      delete file.meta.patch;
      delete file.meta.contents_url;

      const ext = path.parse(file.meta.filename).ext;
      let set = filtersList.filter(f => f.ext === ext);

      if (set.length > 1) {
        throw new Error(`More than one object for extension "${ext}" specified in a config/filters.json.`);
      }

      set = set.pop();
      set.filters.forEach((filterName) => {
        const filter = require(path.join(__dirname, 'filters/', filterName));
        const content = new Buffer(file.blob.content, 'base64').toString();
        let filteredData = {};

        if ('parser' in set) {
          // Apply parser before running a filtering functions. Parser needs to return an array
          // of strings.
          const strings = require(path.join(__dirname, set.parser.module))(
            content,
            set.parser.config || {});

          filteredData = filter(strings);
        } else {
          filteredData = filter(content);
        }

        if (filteredData.isError) issues.push({ file: file.meta, filter: filteredData });
      });
    });

    return issues;
  })
  .then((issues) => {
    const html = require(path.join(__dirname, 'render'))({ issues });
    cb(null, html);
  })
  .catch((err) => {
    console.error('Github API returned an error. Check privileges of your access token.');
    cb(err);
  });

  return true;
};
