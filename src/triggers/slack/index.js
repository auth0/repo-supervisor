import req from 'request-promise';
import config from './../../../.config.json';

module.exports = (repo, reportURL) => {
  req.debug = true;

  const payload = JSON.stringify({
    text: `Secrets detected in *${repo}*: ${reportURL}`
  });

  const options = {
    method: 'POST',
    uri: config.SlackURL,
    form: { payload }
  };

  return req(options);
};
