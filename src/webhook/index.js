import { flatten } from 'lodash';
import { Promise } from 'bluebird';
import path from 'path';
import config from './../../config/main.json';
import filters from './../filters';

module.exports = ({
  parse: (service, pullRequestId, owner, repo, rawOutput) =>
    // Get list of files in a specific pull request
    service.pulls.listFiles({ owner, repo, pull_number: pullRequestId })
      .then((resp) => {
        const exts = config.pullRequests.allowedExtensions;
        const paths = config.pullRequests.excludedPaths;
        const files = resp.data.filter(file => exts.indexOf(path.parse(file.filename).ext) > -1)
          .filter((file) => {
            const len = paths.length;
            return paths.filter(r => !file.filename.match(RegExp(r))).length === len;
          });

        return files;
      }).then(files => Promise.map(files, file =>
        service.git.getBlob({ owner, repo, file_sha: file.sha }).then(
          resp => ({ blob: resp.data, meta: file })
        )
      )).then((files) => {
        // Apply filters specific for file types
        const issues = [];

        files.forEach((file) => {
          // Remove sensitive and memory consuming elements.
          delete file.meta.patch;
          delete file.meta.contents_url;

          const issuesDetails = filters.processFile(file.meta, file.blob.content);
          if (issuesDetails.length > 0) {
            issues.push(issuesDetails);
          }
        });

        return flatten(issues);
      })
      .then(issues => require('../render/index.js')({ issues }, rawOutput))
});
