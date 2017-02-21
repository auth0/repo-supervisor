'use strict';

const config = require('../../../config/main.json');
const filtersList = require('../../../config/filters.json');
const path = require('path');

module.exports = ({
  parse: (service, pullRequestId, owner, repo, rawOutput) =>
    // Get list of files in a specific pull request
    service.pullRequests.getFiles({ owner, repo, number: pullRequestId })
    .then((resp) => {
      const exts = config.pullRequests.allowedExtensions;
      const files = resp.filter(file => exts.indexOf(path.parse(file.filename).ext) > -1);

      return files;
    })
    .map(file => service.gitdata.getBlob({ owner, repo, sha: file.sha }).then(
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
          throw new Error(`More than one object for the same extension "${ext}" specified in a config/filters.json.`);
        }

        set = set.pop();
        set.filters.forEach((filterName) => {
          const filter = require(path.join(__dirname, '../../filters/', filterName));
          const content = new Buffer(file.blob.content, 'base64').toString();
          let filteredData = {};

          if ('parser' in set) {
            // Apply parser before running a filtering functions. Parser needs to return an array
            // of strings.
            const strings = require(path.join(__dirname, '../', set.parser.module))(
              content,
              set.parser.config || {}
            );

            filteredData = filter(strings);
          } else {
            filteredData = filter(content);
          }

          if (filteredData.isError) issues.push({ file: file.meta, filter: filteredData });
        });
      });

      return issues;
    })
    .then(issues => require(path.join(__dirname, '../../render'))({ issues }, rawOutput))
});
