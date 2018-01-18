import path from 'path';
import filtersList from './../../config/filters.json';

function getSet(ext) {
  const set = filtersList.filter(f => f.ext === ext);

  if (set.length > 1) {
    throw new Error(`More than one object for the same extension "${ext}" specified in a config/filters.json.`);
  }
  return set;
}

module.exports = {
  processFile: (metadata, fileContent, isPlainFile) => {
    if (!fileContent || fileContent.length === 0) {
      return [];
    }

    const ext = path.parse(metadata.filename).ext;
    const issues = [];
    let set = getSet(ext);

    if (set.length === 0) {
      // See if the "any file" filter is in use
      set = getSet('*');
    }

    if (set.length === 0) {
      // No filter defined for this extension.
      return [];
    }

    set = set.pop();
    set.filters.forEach((filterName) => {
      const filter = require(`./${filterName}`);
      const content = isPlainFile ? fileContent : new Buffer(fileContent, 'base64').toString();
      let filteredData = {};

      if ('parser' in set) {
        // Apply parser before running a filtering functions. Parser needs to return an array
        // of strings.
        const strings = require(`./../parser/${set.parser.module}`)(
          content,
          set.parser.config || {}
        );
        filteredData = filter(strings);
      } else {
        filteredData = filter(content);
      }

      if (filteredData.isError) issues.push({ file: metadata, filter: filteredData });
    });

    return issues;
  }
};
