// import hb from 'handlebars';
import dataHelper from './helpers/data';

const tpl = require('./templates/default.handlebars');

module.exports = (data, rawOutput) => {
  // Register helpers
  // const helpers = require('./../../config/render/helpers.json');

  // helpers.enabled.forEach((cfg) => {
  //   const helper = require(`./templates/helpers/${cfg}`)(helpers.options);
  //   hb.registerHelper(helper.name, helper.cb);
  // });

  if (rawOutput) return data;

  // Group by filter
  return tpl(dataHelper.groupByFilter(data.issues));
};
