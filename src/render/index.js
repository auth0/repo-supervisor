// import hb from 'handlebars';
import dataHelper from './helpers/data';

const tpl = require('./templates/default.handlebars');

module.exports = (data, rawOutput) => {
  if (rawOutput) return data;

  // Group by filter
  return tpl(dataHelper.groupByFilter(data.issues));
};
