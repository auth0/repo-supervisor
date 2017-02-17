const fs = require('fs');
const hb = require('handlebars');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, 'templates/default.html'), 'utf-8');
const tpl = hb.compile(src);

module.exports = (data) => {
  // Register helpers
  const helpers = require(path.join(__dirname, '../../config/render/helpers.json'));

  helpers.enabled.forEach((cfg) => {
    const helper = require(path.join(__dirname, 'helpers', cfg))(helpers.options);
    hb.registerHelper(helper.name, helper.cb);
  });

  return tpl(data);
};
