const req = require('request-promise');
const config = require('./../../../config/main.json');

module.exports = async (message) => {
  // req.debug = true;
  const slackURL = process.env.SLACK_URL;
  const payload = JSON.stringify({
    type: config.triggerTextFormat,
    text: message
  });
  const options = {
    method: 'POST',
    uri: slackURL,
    form: { payload }
  };

  if (!slackURL) {
    return Promise.reject(new Error(config.triggerMessages.slackUrlNotProvided));
  }

  return req(options);
};
